import parse from "csv-parser";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import Planet from "./planets.mongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.time("createReadStreamTime");
function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6 &&
    planet
  );
}
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(
        __dirname,
        "..",
        "..",
        "data",
        "cumulative_2023.11.06_07.19.42.csv"
      )
    )
      //pipe collega una sorgente di flusso leggibile ad un flusso di destinazione scrivibile
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) await savePlanet(data);
      })
      .on("error", (err) => reject(err))
      .on("end", async () => {
        const countPlanets = (await getPlanets()).length;
        console.log(`Esistono ${countPlanets} pianeti abitabili`);
        resolve();
      });
  });
}
async function savePlanet(planet) {
  try {
    await Planet.updateOne(
      // filter
      {
        keplerName: planet.kepler_name,
      },
      //update
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.log("Could not save planet" + error);
  }
}
async function getPlanets() {
  return await Planet.find({}, { _id: 0, __v: 0 });
  //1 {}=> specifichiamo dei filtri
  //2 {}=> (projection)i campi che vogliamo selezionare 1=>mostra 0=>esclude
  // per selezionar più campi "keplername mission" => con questa sintassi per escludere utilizz prefissi "-" o "+"
  //possiamo utilizzare degli operatori come "$gte" o regex per filtrare i risultati
  // return await Planet.find(
  //   {
  //     keplerName: "Kepler-62 f",
  //   },
  //   { keplerName: 1 }
  // );
}
//il module verrà esportato prima che loperazione con stream sia completatata
export { loadPlanetsData, getPlanets };

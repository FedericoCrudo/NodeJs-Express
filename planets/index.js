const parse = require("csv-parser");
const fs = require("fs");
const habitablePlanets = [];
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
// alternative evet emitter const read= fs.createReadStream; read.on("data")
fs.createReadStream("./data/cumulative_2023.11.06_07.19.42.csv")
  //pipe collega una sorgente di flusso leggibile ad un flusso di destinazione scrivibile
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHabitablePlanet(data)) habitablePlanets.push(data);
  })
  .on("error", (err) => console.log(err))
  .on("end", () => {
    console.log(habitablePlanets.map((el) => el.kepler_name));
    console.timeEnd("createReadStreamTime");
    console.log(`Esistono ${habitablePlanets.length} pianeti abitabili`);
  });

import dotenv from "dotenv";
import app from "./app.js";

import { loadPlanetsData } from "./models/planets.model.js";
import { mongoConnect } from "./utils/mongo.js";
// Le eccezioni non rilevate si verificano quando viene generato un errore ma non viene rilevato da alcun blocco try-catch o gestore di errori
//ES log(x) x is not defined
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const port = process.env.PORT;
await mongoConnect();
await loadPlanetsData();

const server = app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});
//Event emitter
// Gestire i rifiuti di promesse non gestiti
process.on("unhandledRejection", (err) => {
  console.log(err.name);
  console.log("unhandled rejection");
  //se ci sono problemi con il db è necessario chiudere l'applicazione
  //0 successo ,1 eccezione non rilevata
  //con close diamo al server il tempo di completare tute le operazionii in corso e successivamente di chiudere il server con exit
  server.close(() => process.exit(1));
});

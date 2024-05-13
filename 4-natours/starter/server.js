const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');
// Uncaught Exceptions
//errori o bug che si verificanoq nel nostro codice sincrono ma non vengono gestiti
//process è un oggetto globale disponibile in node che fornisce informazioni e funzionalitò relative al processo in esecuzione.
//Questo oggetto è parte dell'ambiente di esecuzione Node.js e offre numerosi metodi e proprietà utili per interagire con il processo in cui il tuo codice Node.js è in esecuzione. Alcune delle funzionalità più comuni fornite da `process` includono:process.env,process.exit()
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log('Db connection successful'))
  .catch((err)=>console.log(err))
// const testTour = new Tour({
//   name: 'The Forest Hiker2',
//   rating: 4.7,
//   price: 497,
// });
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
const port = process.env.PORT;
//modalità utilizzata
// console.log(app.get('env'));
// console.log(process.env);
// per settare env: NODE_ENV=development nodemon server.js
const server = app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('unhandled rejection');
  //se ci sono problemi con il db è necessario chiudere l'applicazione
  //0 successo ,1 eccezione non rilevata
  //con close diamo al server il tempo di completare tute le operazionii in corso e successivamente di chiudere il server con exit
  server.close(() => process.exit(1));
});

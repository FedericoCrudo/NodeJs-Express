const { error } = require("console");
const fs = require("fs");
const server = require("http").createServer();


server.on("request", (req, res) => {
  //Solution 1
  //in questo modo dovrà caricare l'intero file in memoria,solo dopo potra inviare i dati
  //questo rappresenta un problema quando il file è di grandi dimensioni e quando ci sono molte   richieste 
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // })
  //Solution 2: Streams
  //il problema con questa soluzione è che il flusso leggibile che stiamo utilizzando  è molto più veloce dell'invio effettivo del risultato con il flusso scrivibile di risposta sulla rete  e questp travolgera  il flusso di risposta, che non puo gestire tutti questi dati in arrivo cosi velocemente
  //questo problema di chiama backpressure
  // Definizione semplificata: Quando un dispositivo o un sistema non può inviare i dati alla stessa velocità con cui li riceve da una sorgente esterna.
  //   const readable = fs.createReadStream("test-file.txt");
  //   readable.on("data", (chunk) => {
  //     //passa le informazioni a chuck 
  //     res.write(chunk);
  //   })
  //   readable.on("end", () => {
  //     //non dobbiamo passare nulla perché le informazioni sono state trasmesse già durante l'handler "data";
  //     res.end();
  //   })
  //   readable.on("error", err => {
  //     console.log(err);
  //     res.statusCode(500);
  //     res.end("File not found");
  //   })
  //Solutions 3
  //per risolvere il backpressure è sufficiente utilizzare pipe(),permette di convogliare output di un flusso leggibile direttamente nell'input di un flusso scrivibile ,quindi gerstirà automaticamente la velocità fondamentalmente dei dati in entrata e uscita
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res)
})

server.listen(8000, "127.0.0.1", () => {
  console.log("listening..")
})
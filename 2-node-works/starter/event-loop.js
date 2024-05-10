const fs = require("fs")
const crypto = require("crypto");
const start = Date.now();
//incrementare dimensioni dei thread disponibili 
process.env.UV_THREADPOOL_SIZE = 8
setTimeout(() => console.log("TImer 1 finished"), 0);//2
setImmediate(() => console.log("immediate 1 finished"));//4
fs.readFile("test-file.txt", () => {//3 aggiunge callback al thread pool //5 esegue la callback
  console.log("I/O finished");
  console.log("---------------");
  //node aspetta che i setTimeout scadano, ma nel mentre rimane della fase di polling
  //ma una volta finito eseguira subito le setImmediate
  setTimeout(() => console.log("TImer 2 finished"), 0);//2
  setTimeout(() => console.log("TImer 3 finished"), 3000);//2
  setImmediate(() => console.log("immediate 2 finished"));//4
  // process.nextTick(() => console.log("process.nextTick"))
  //dopo le prime 4 i tempi di esecuzione iniziano ad aumentare questo perché node dispone solo di 4 thread
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encrypted")
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encrypted")
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encrypted")
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encrypted")
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encrypted")
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encrypted")
  });
})


console.log("Hello from the top-level code ")//1
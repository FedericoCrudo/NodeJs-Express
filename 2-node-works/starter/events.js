const EventEmitter = require("events");
const http = require("http");
//best practice
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("new sale");
});

myEmitter.on("newSale", () => {
  console.log("Customer name: Federico");
});

myEmitter.on("newSale", (stock) => {
  console.log(stock, "items");
});

myEmitter.emit("newSale", 9);

////////////////////////////
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("request received");
  res.end("REquest received");
});

server.on("request", (req, res) => {
  console.log("Another request");
});

server.on("close", () => {
  console.log("server close");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for request..");
});

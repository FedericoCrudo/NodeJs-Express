const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");
/////////////////////////////////////
//FILES
// Blocking sync
// const textIn = fs.readFileSync("./txt/input.txt", 'utf-8');
// console.log(textIn)
// const textOut = `this is what we know about the avocado: ${textIn} \n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written!")

// Non-Blocking async
// fs.readFile("./txt/start.txt", { encoding: "utf-8" }, (err, data1) => {
//   if (err) return console.log("Error")
//   fs.readFile(`./txt/${data1}.txt`, { encoding: "utf-8" }, (err, data2) => {
//     console.log(data2)
//     fs.readFile("./txt/append.txt", { encoding: "utf-8" }, (err, data3) => {
//       console.log(data3)
//       fs.writeFile("./txt/final.txt", `${data2}\n ${data3}`, "utf-8", error => {
//         console.log("your file has been written")
//       })
//     })
//   })
// })
// console.log("Will read file ");

/////////////////////////////////////
//SERVER
//in questo modo evitiamo che ad ogni richiesta vado a leggere i dati all'interno del file
//memorizza il valore in data e viene utilizzato sulla rotta /api
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
//TEMPLATE
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

//accetta una callback che verra attivata ogni volta che una nuova richiesta raggiungere il nostro server
//la callback accede a due variabilki molto importanti(request and response)
const server = http.createServer((req, res) => {
  //con true andrà ad analizzare anche la query ?id=0
  const { query, pathname: pathName } = url.parse(req.url, true);
  //Overview Page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(output);
  }
  //Product Page
  else if (pathName === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  }
  //API
  else if (pathName === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }
  // Not found
  else {
    //prima di inviare la risposta
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>Page not found!</h1>");
  }
  //metodo più semplice per inviare una risposta molto semplice come questa
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
});

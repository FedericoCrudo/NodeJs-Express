const http = require("http");
const url = require("url");
const PORT = 8000;
const friends = [
  {
    id: 0,
    name: "Federico",
  },
  {
    id: 1,
    name: "Lorenzo",
  },
];
const server = http.createServer();

server.on("request", (req, res) => {
  const { query, pathname: pathName } = url.parse(req.url, true);
  if (req.method === "POST" && pathName === "/friends") {
    req.on("data", (data) => {
      //data=> quando i dati diventano disponibili nel redable stream viene emesso questo evento data
      //conversione esadeciamele
      const friend = JSON.parse(data.toString());
      friends.push(friend);
      res.writeHead(200, {
        "Content-Type": "text/json",
      });
      res.end(
        JSON.stringify({
          status: "success",
          data: friend,
        })
      );
    });
    // req.pipe(res);
  } else if (
    req.method === "GET" &&
    (pathName === "/friends" || pathName === "/")
  ) {
    res.writeHead(200, {
      "Content-Type": "text/plain",
    });
    if (friends.some((el) => el.id === +query.id)) {
      res.end(JSON.stringify(friends[+query.id]));
    } else {
      res.end(JSON.stringify(friends));
    }
  } else if (req.method === "GET" && pathName === "/messages") {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    // res.write("<html>");
    // res.write("<body>");
    // res.write("<ul>");
    // res.write("<li>Hello</li>");
    // res.write("<li>what are your thoughts </li>");
    // res.write("</ul>");
    // res.write("</body>");
    // res.write("</html>");
    const template = `<html><body><p>Ciapo</p> <ul><li>Ptova</li></ul></body></html>`;
    res.end(template);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log("server start..");
});

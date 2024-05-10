import express from "express";
import friendsRouter from "./routes/friends.route.js";
import messagesRouter from "./routes/messages.router.js";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8000;

const app = express();
//TEMPLATE ENGINE
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

//in questo modo il middleware guardarà il percorso assoluto
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", {
    title: "My friends",
    caption: "Let go skiing",
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${req.method} ${req.baseUrl}${req.url}`);
  //chiamerà la rotta che abbiamo richiesto
  next();
  //dopo aver eseguito la rotta ritorna nel middleware
  const delta = Date.now() - start;
  console.log("Delta: " + delta + " ms");
});

/* 
  FRIENDS
*/
// before
// const router = express.Router();
//  .get("/", getFriends);

app.use("/friends", friendsRouter);
/* 
  MESSAGES
*/
app.use("/messages", messagesRouter);

app.listen(PORT, () => {
  console.log(`Listening ${PORT}`);
});

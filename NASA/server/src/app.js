import express from "express";
import cors from "cors";
import morgan from "morgan";
import planetsRouter from "./routes/planets/planets.router.js";
import launchesRouter from "./routes/launches/launches.router.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
//in questo modo consentiamo il bypass solo per il front-end
app.use(
  cors({
    origin: "http://localhost:8000",
  })
);
//LOG
app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));
app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);
//in questo modo se non trova una rotta prima di questo step andrà su index(react)
app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "client", "build", "index.html")
  );
});
export default app;

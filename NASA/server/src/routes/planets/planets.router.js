import express from "express";
import { getAllPlanets } from "../../../controllers/planets.controller.js";

const planetsRouter = express.Router();

planetsRouter.get("/", getAllPlanets);

export default planetsRouter;

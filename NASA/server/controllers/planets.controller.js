import { getPlanets } from "../src/models/planets.model.js";
async function getAllPlanets(req, res) {
  return res.status(200).json(await getPlanets());
}

export { getAllPlanets };

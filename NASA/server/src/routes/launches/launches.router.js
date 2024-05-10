import express from "express";
import {
  getAllLaunches,
  addLaunch,
  deleteLaunche,
} from "../../../controllers/launches.controller.js";

const router = express.Router();

router.route("/").get(getAllLaunches).post(addLaunch);
router.route("/:id").delete(deleteLaunche);

export default router;

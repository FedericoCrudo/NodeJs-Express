import {
  getLaunches,
  scheduleNewLaunch,
  deleteLaunch,
  existsLaunchWithId,
} from "../src/models/launches.model.js";

async function getAllLaunches(req, res) {
  return res.status(200).json(await getLaunches());
}
async function addLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      status: "failed",
      messsage: "One or more fields is empty",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate))
    return res.status(400).json({
      status: "failed",
      messsage: "Invalid launch date",
    });
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}
async function deleteLaunche(req, res) {
  const id = +req.params.id;
  const existsLaunch = await existsLaunchWithId(id);
  if (!existsLaunch)
    return res.status(404).json({
      status: "failed",
      messages: "flightNumber doesn't exist",
    });
  const aborted = await deleteLaunch(id);
  return res.status(200).json(aborted);
}
export { getAllLaunches, addLaunch, deleteLaunche };

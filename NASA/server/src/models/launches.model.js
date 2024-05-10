import Launch from "./launches.mongo.js";
import Planet from "./planets.mongo.js";
const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 0;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
};
saveLaunch(launch);
// launches.set(launch.flightNumber, launch);
async function getLaunches() {
  return await Launch.find({}, "-_id -__v");
}
async function saveLaunch(launch) {
  const planet = await Planet.find({ keplerName: launch.target });
  if (!planet) throw new Error("No matching planet");
  await Launch.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}
async function getLastestFlightNumber() {
  const lastest = await Launch.findOne().sort("-flightNumber");
  if (!lastest) return DEFAULT_FLIGHT_NUMBER;
  return lastest.flightNumber;
}
async function scheduleNewLaunch(launch) {
  const lastestFlight = (await getLastestFlightNumber()) + 1;
  const addNewLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: lastestFlight,
  });
  await saveLaunch(addNewLaunch);
}
// function addNewLaunch(launch) {
//   lastestFlightNumber++;
//   launches.set(
//     lastestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ["ZTM", "NASA"],
//       flightNumber: lastestFlightNumber,
//     })
//   );
// }
// function deleteLaunch(launchId) {
//   const aborted = launches.get(launchId);
//   aborted.upcoming = false;
//   aborted.success = false;
//   return aborted;
// }
async function deleteLaunch(launchId) {
  return await Launch.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
}
async function existsLaunchWithId(id) {
  return await Launch.findOne({ flightNumber: id });
}
export { getLaunches, scheduleNewLaunch, deleteLaunch, existsLaunchWithId };

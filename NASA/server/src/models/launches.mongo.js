import mongoose from "mongoose";

const launchSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  // Reference
  // target: {
  //   type: mongoose.isObjectIdOrHexString,
  //   ref: "Planet",
  //   required: true,
  // },
  target: {
    type: String,
    required: true,
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});
//collega lo schema che abbiamo crato alla launches collection
const Launch = mongoose.model("Launch", launchSchema);
export default Launch;

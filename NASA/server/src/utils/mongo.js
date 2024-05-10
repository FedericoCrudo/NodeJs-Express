import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });
mongoose.connection.once("open", () => {
  console.log("MongoDb connection ready");
});
//ERROR
mongoose.connection.once("error", (e) => {
  console.error("MongoDb:", e);
});
async function mongoConnect() {
  await mongoose.connect(process.env.DATABASE);
}

export { mongoConnect };

import mongoose from "mongoose";

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});
//sempre al singolare,si occuperà mongodb della modifica della naming
const Planet = mongoose.model("Planet", planetSchema);
export default Planet;

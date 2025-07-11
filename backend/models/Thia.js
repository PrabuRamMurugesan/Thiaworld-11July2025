import mongoose from "mongoose";

const thiaSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
});

const Thia = mongoose.model("Thia", thiaSchema);
export default Thia;

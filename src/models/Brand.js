import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  namn: { type: String, required: true, trim: true },
});

export default mongoose.model("Brand", brandSchema);

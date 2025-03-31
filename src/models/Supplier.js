import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  namn: { type: String, required: true, trim: true },
});

export default mongoose.model("Supplier", supplierSchema);

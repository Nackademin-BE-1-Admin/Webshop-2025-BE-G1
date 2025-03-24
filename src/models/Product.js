import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  namn: {
    type: String,
    required: true,
    trim: true,
  },
  beskrivning: {
    type: String,
    default: "",
  },
  pris: {
    type: Number,
    required: true,
    min: 0,
  },
  kategorier: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
}, {
  timestamps: true,
});

export default mongoose.model("Product", productSchema);

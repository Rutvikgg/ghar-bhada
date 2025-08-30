import mongoose from "mongoose";

const RentCollectionSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
  },
  receipt_no: {
    type: String,
    required: true,
    unique: true,
  },
  collection_date: {
    type: Date,
    default: Date.now,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  total_months: {
    type: Number,
    required: true,
  },
  total_rent: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.RentCollection ||
  mongoose.model("RentCollection", RentCollectionSchema);

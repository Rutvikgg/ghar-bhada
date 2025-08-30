import mongoose from "mongoose";

const TenantHistorySchema = new mongoose.Schema({
  name: String,
  mobile_number: String,
  rent_amount: Number,
  changedAt: {
    type: Date,
    default: Date.now,
  },
});

const TenantSchema = new mongoose.Schema({
  sr_no: {
    type: Number,
    required: [true, "Please provide a serial number."],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please provide the tenant's name."],
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  mobile_number: {
    type: String,
    required: [true, "Please provide the tenant's mobile number."],
  },
  rent_amount: {
    type: Number,
    required: [true, "Please provide the rent amount."],
  },
  history: [TenantHistorySchema],
});

export default mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema);

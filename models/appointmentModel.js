import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    address: {
      houseNo: { type: String },
      city: { type: String },
      street: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamp: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;

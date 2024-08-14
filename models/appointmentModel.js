import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

const Appointment = mongoose.model("Appointments", appointmentSchema);

export default Appointment;

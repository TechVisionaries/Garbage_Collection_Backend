import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  status: { type: String, default: "pending" },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;

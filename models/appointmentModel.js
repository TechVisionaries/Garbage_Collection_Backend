import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  date: {
    type: String,
    required: true,
  },
  address: {
    houseNo: String,
    street: String,
    city: String,
  },
  status: {
    type: String,
    default: "pending",
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;

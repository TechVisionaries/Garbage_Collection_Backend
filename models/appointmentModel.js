import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
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

import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import moment from "moment";
import checkAppointmentApproval from "../utils/checkAppointmentApproval.js";

const createAppointment = async (req, res) => {
  try {
    const { date, address, status } = req.body;

    // Create new appointment instance
    const appointment = new Appointment({
      date,
      address,
      status: status || "pending",
    });

    // Save to database
    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("userId");
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.deleteOne();
    res.json({ message: "Appointment removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { createAppointment, getAllAppointments, cancelAppointment };

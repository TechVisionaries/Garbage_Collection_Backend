import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import moment from "moment";
import checkAppointmentApproval from "../utils/checkAppointmentApproval.js";
import mongoose from "mongoose";

const createAppointment = async (req, res) => {
  try {
    const { userId, date, address, status } = req.body;

    // Create new appointment instance
    const appointment = new Appointment({
      userId,
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

// get all appointments of a user by userId
const getMyAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const appointments = await Appointment.find({ userId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error getting appointments", error });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Only pending appointments can be cancelled" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
};

// Check if the user has already scheduled an appointment for the selected date if the get the appointment
const checkDuplicateAppointment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;

    const appointmentExists = await Appointment.exists({
      userId: userId,
      date: date,
    });

    res.status(200).json({ exists: appointmentExists });
  } catch (error) {
    res.status(500).json({ message: "Error checking appointment", error });
  }
};

export {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  checkDuplicateAppointment,
};

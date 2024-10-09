import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import moment from "moment";
import checkAppointmentApproval from "../utils/checkAppointmentApproval.js";
import mongoose from "mongoose";

const createAppointment = async (req, res) => {
  try {
    const { userId, date, status, location, driver,garbageTypes } = req.body;
    console.log(req.body); // Log the incoming request body

    
    // check if the user exists
    if (!userId) {
      return res.status(400).json({ message: "User is required" });
    }
    
    // check if the date exists
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
    
    // check if the location there
    if (!location || !location.latitude || !location.longitude) {
      return res
        .status(400)
        .json({ message: "Location with latitude and longitude is required" });
    }

    // check if the driver exists
    if (!driver) {
      return res.status(400).json({ message: "Driver is required" });
    }

       // Ensure garbageType there
    if (!Array.isArray(garbageTypes) || garbageTypes.length === 0) {
      return res
        .status(400)
        .json({ message: "Garbage type must be a non-empty array of strings" });
    }


    const appointment = new Appointment({
      userId,
      date,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      status: status || "pending",
      driver,
      garbageTypes
    });
    
    // id the driver has more than 3 appointments update all to accepted including the new one
    await checkAppointmentApproval(appointment);

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

// get all appointments of a driver by driverId
const getDriverAppointments = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { date } = req.query;
    const appointments = await Appointment.find({
      driver: driverId,
      status: { $in: ["accepted", "completed"] },
      date: date // Assuming 'date' is stored in 'YYYY-MM-DD' format
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error getting appointments", error });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.status = "completed";
    await appointment.save();

    res.status(200).json({ message: "Appointment completed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
}

// get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error getting appointments", error });
  }
};




export {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  checkDuplicateAppointment,
  getDriverAppointments,
  completeAppointment,
  getAllAppointments,
};

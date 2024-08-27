import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import moment from "moment";
import checkAppointmentApproval from "../utils/checkAppointmentApproval.js";

const createAppointment = async (req, res) => {
  try {
    const { date, userId, address } = req.body;

    // Validate the date and userId fields
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Check if the time is after 12 PM
    // const appointmentTime = moment(date);
    // if (appointmentTime.hour() >= 12) {
    //   return res
    //     .status(400)
    //     .json({ message: "Appointments cannot be scheduled after 12 PM" });
    // }

    // Retrieve user's home address if no address is provided
    let finalAddress = address;

    if (!address) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      finalAddress = user.address;
    }

    // Check if an appointment already exists for the same user, address, and date
    const existingAppointment = await Appointment.findOne({
      userId,
      date,
      "address.houseNo": finalAddress.houseNo,
      "address.street": finalAddress.street,
      "address.city": finalAddress.city,
    });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "You already have an appointment scheduled for this day at this address.",
      });
    }

    const appointment = new Appointment({
      userId,
      date,
      address: finalAddress,
    });

    const createdAppointment = await appointment.save();
    await checkAppointmentApproval(createdAppointment); // Check for appointment approval

    const populatedAppointment = await Appointment.findById(
      createdAppointment._id
    ).populate("userId");
    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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

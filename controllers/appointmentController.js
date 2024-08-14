import Appointment from "../models/appointmentModel.js";

const createAppointment = async (req, res) => {
  try {
    // get user id from req.user
    // const userId = req.user._id;
    const { date, userId } = req.body;

    // Validate the date field
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const appointment = new Appointment({
      userId,
      date,
    });

    const createdAppointment = await appointment.save();

    // Populate appointment with user
    const populatedAppointment = await Appointment.findById(
      createdAppointment._id
    ).populate("userId");

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const reviewAppointments = async (req, res) => {};

export { createAppointment, reviewAppointments };

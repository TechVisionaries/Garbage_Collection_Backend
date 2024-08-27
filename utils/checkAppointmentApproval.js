import Appointment from "../models/appointmentModel.js";

const checkAppointmentApproval = async (appointment) => {
  const { date, address } = appointment;
  console.log(date);

  const appointmentCount = await Appointment.countDocuments({
    date,
    "address.street": address.street,
  });

  console.log(appointmentCount);

  if (appointmentCount >= 3) {
    // Update all matching appointments to 'accepted'
    await Appointment.updateMany(
      {
        date,
        "address.street": address.street,
        status: "pending",
      },
      { $set: { status: "accepted" } }
    );
  }
};

export default checkAppointmentApproval;

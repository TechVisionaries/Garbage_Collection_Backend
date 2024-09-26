import Appointment from "../models/appointmentModel.js";

const checkAppointmentApproval = async (appointment) => {
  const { driver,date } = appointment;

  const appointmentCount = await Appointment.countDocuments({
    driver,
    date,
    status: "pending",
  });

  console.log(appointmentCount);

  if (appointmentCount >= 3) {
    // Update all matching appointments to 'accepted'
    await Appointment.updateMany(
      {
        driver,
        status: "pending",
        date,
      },
      { $set: { status: "accepted" } }
    );
       // Update the status of the current appointment object in memory
       appointment.status = "accepted";
  }
};

export default checkAppointmentApproval;

import express from "express";
import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  checkDuplicateAppointment,
  getDriverAppointments,
  completeAppointment,
  getAllAppointments,
  getMyDriverAppointments,
  acceptAppointment,
  deleteAppointmentById,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/:userId", getMyAppointments);
router.put("/cancel/:id", cancelAppointment);
router.get("/check/:userId/", checkDuplicateAppointment);
router.get("/driver/:driverId", getDriverAppointments)
router.put("/complete/:id", completeAppointment)
router.get("/", getAllAppointments)
router.get("/driver/my/:driverId", getMyDriverAppointments)
router.put("/accept/:id", acceptAppointment)
router.delete("/:id", deleteAppointmentById)


export default router;

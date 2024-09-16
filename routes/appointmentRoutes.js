import express from "express";
import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  checkDuplicateAppointment,
  getDriverAppointments,
  completeAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/:userId", getMyAppointments);
router.put("/:id", cancelAppointment);
router.get("/check/:userId/", checkDuplicateAppointment);
router.get("/driver/:driverId", getDriverAppointments)
router.put("/complete/:id", completeAppointment)

export default router;

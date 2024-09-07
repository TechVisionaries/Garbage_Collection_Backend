import express from "express";
import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/:userId", getMyAppointments);
router.put("/:id", cancelAppointment);

export default router;

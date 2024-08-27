import express from "express";
import {
  createAppointment,
  getAllAppointments,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);

export default router;

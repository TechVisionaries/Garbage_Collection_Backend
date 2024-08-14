import express from "express";
import {
  createAppointment,
  reviewAppointments,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/review", reviewAppointments);

export default router;

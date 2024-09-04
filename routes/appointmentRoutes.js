import express from "express";
import {
  createAppointment,
  getAllAppointments,
  cancelAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.delete("/:id", cancelAppointment);

export default router;

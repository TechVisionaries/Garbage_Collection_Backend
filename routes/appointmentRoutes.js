import express from "express";
import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  checkDuplicateAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", createAppointment);
router.get("/:userId", getMyAppointments);
router.put("/:id", cancelAppointment);
router.get("/check/:userId/", checkDuplicateAppointment);

export default router;

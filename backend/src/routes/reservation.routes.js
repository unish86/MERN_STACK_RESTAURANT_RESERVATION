import { Router } from "express";
import {
  createReservation,
  getReservations,
  updateReservationStatus
} from "../controllers/reservation.controller.js";
import { requireAdmin } from "../middlewares/adminAuth.js";

const router = Router();

router.post("/send", createReservation);
router.get("/", requireAdmin, getReservations);
router.patch("/:id/status", requireAdmin, updateReservationStatus);

export default router;

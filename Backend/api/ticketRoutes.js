import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  assignTicket,
  updateTicketStatus,
  addTicketComment,
  getTicketComments,
} from "../controllers/ticketController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protect middleware to all ticket routes
router.use(protect);

// Ticket CRUD routes
router.route("/").post(createTicket).get(getTickets);

router.route("/:id").get(getTicketById).put(updateTicket);

// Assign ticket (technicians, managers, admins)
router
  .route("/:id/assign")
  .patch(authorize("technician", "it_manager", "system_admin"), assignTicket);

// Update ticket status
router.route("/:id/status").patch(updateTicketStatus);

// Ticket Comments / Work logs
router.route("/:id/comments").post(addTicketComment).get(getTicketComments);

export default router;

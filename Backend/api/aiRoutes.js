import express from "express";
import {
  queryAIRag,
  addFAQToKB,
  addBulkFAQsToKB,
} from "../controllers/aiController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Query local AI RAG model for solution answers
router.post("/query", queryAIRag);

// Knowledge vector store updates
router.post(
  "/knowledge/faq",
  authorize("system_admin", "it_manager", "technician"),
  addFAQToKB
);

router.post(
  "/knowledge/faqs",
  authorize("system_admin", "it_manager"),
  addBulkFAQsToKB
);

export default router;

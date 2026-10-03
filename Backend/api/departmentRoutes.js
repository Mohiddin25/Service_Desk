import express from "express";
import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorize("system_admin", "it_manager"), createDepartment)
  .get(getDepartments);

router
  .route("/:id")
  .get(getDepartmentById)
  .put(authorize("system_admin", "it_manager"), updateDepartment)
  .delete(authorize("system_admin"), deleteDepartment);

export default router;

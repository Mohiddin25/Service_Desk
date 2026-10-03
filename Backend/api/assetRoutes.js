import express from "express";
import {
  createAsset,
  getAssets,
  getMyAssets,
  getAssetById,
  updateAsset,
  assignAsset,
  updateAssetStatus,
  deleteAsset,
} from "../controllers/assetController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protect middleware to all asset routes
router.use(protect);

// My assets route (all logged in users)
router.get("/my-assets", getMyAssets);

// Asset CRUD routes
router
  .route("/")
  .post(authorize("asset_manager", "system_admin"), createAsset)
  .get(
    authorize("asset_manager", "it_manager", "technician", "system_admin"),
    getAssets
  );

router
  .route("/:id")
  .get(getAssetById)
  .put(authorize("asset_manager", "system_admin"), updateAsset)
  .delete(authorize("asset_manager", "system_admin"), deleteAsset);

// Assign asset to user / department
router
  .route("/:id/assign")
  .patch(
    authorize("asset_manager", "it_manager", "system_admin"),
    assignAsset
  );

// Update asset lifecycle status
router
  .route("/:id/status")
  .patch(
    authorize("asset_manager", "technician", "it_manager", "system_admin"),
    updateAssetStatus
  );

export default router;

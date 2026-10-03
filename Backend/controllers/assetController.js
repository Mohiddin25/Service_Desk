import Asset from "../models/assetModel.js";
import User from "../models/userModel.js";
import Department from "../models/departmentModel.js";

/**
 * Helper function to generate unique asset tags (e.g. AST-2026-A1B2)
 */
const generateAssetTag = () => {
  const year = new Date().getFullYear();
  const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AST-${year}-${randomHex}`;
};

/**
 * @desc    Create a new asset
 * @route   POST /api/assets
 * @access  Private (Asset Manager, Admin)
 */
export const createAsset = async (req, res) => {
  try {
    const {
      name,
      category,
      modelNumber,
      serialNumber,
      status,
      assignedTo,
      department,
      purchaseDate,
      warrantyExpiration,
      cost,
      notes,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Asset name is required" });
    }

    let assetTag = req.body.assetTag ? req.body.assetTag.trim() : generateAssetTag();

    // Check tag uniqueness
    let exists = await Asset.findOne({ assetTag });
    if (req.body.assetTag && exists) {
      return res.status(400).json({ message: "Asset tag already exists" });
    }
    while (exists) {
      assetTag = generateAssetTag();
      exists = await Asset.findOne({ assetTag });
    }

    // Determine initial status based on assignment
    let initialStatus = status || "in_inventory";
    if (assignedTo && !status) {
      initialStatus = "assigned";
    }

    const asset = await Asset.create({
      assetTag,
      name,
      category: category || "other",
      modelNumber: modelNumber || "",
      serialNumber: serialNumber || "",
      status: initialStatus,
      assignedTo: assignedTo || null,
      department: department || null,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      warrantyExpiration: warrantyExpiration ? new Date(warrantyExpiration) : null,
      cost: cost ? parseFloat(cost) : 0,
      notes: notes || "",
    });

    const populated = await Asset.findById(asset._id)
      .populate("assignedTo", "name email role department")
      .populate("department", "name code");

    return res.status(201).json(populated);
  } catch (error) {
    console.error("Create Asset Error:", error);
    return res.status(500).json({ message: error.message || "Failed to create asset" });
  }
};

/**
 * @desc    Get all assets with search, filters & pagination
 * @route   GET /api/assets
 * @access  Private (Asset Manager, IT Manager, Tech, Admin)
 */
export const getAssets = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { assetTag: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
        { modelNumber: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Asset.countDocuments(query);
    const assets = await Asset.find(query)
      .populate("assignedTo", "name email role department")
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.json({
      assets,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error("Get Assets Error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch assets" });
  }
};

/**
 * @desc    Get logged-in user's assigned assets
 * @route   GET /api/assets/my-assets
 * @access  Private (All Users)
 */
export const getMyAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ assignedTo: req.user._id })
      .populate("department", "name code")
      .sort({ createdAt: -1 });

    return res.json(assets);
  } catch (error) {
    console.error("Get My Assets Error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch user assets" });
  }
};

/**
 * @desc    Get asset by ID
 * @route   GET /api/assets/:id
 * @access  Private
 */
export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate("assignedTo", "name email role department")
      .populate("department", "name code");

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Security check: regular employees can only view asset if assigned to them
    if (
      req.user.role === "employee" &&
      (!asset.assignedTo || asset.assignedTo._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Not authorized to view this asset" });
    }

    return res.json(asset);
  } catch (error) {
    console.error("Get Asset By ID Error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch asset" });
  }
};

/**
 * @desc    Update asset details
 * @route   PUT /api/assets/:id
 * @access  Private (Asset Manager, Admin)
 */
export const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    const {
      name,
      category,
      modelNumber,
      serialNumber,
      purchaseDate,
      warrantyExpiration,
      cost,
      notes,
    } = req.body;

    if (name) asset.name = name;
    if (category) asset.category = category;
    if (modelNumber !== undefined) asset.modelNumber = modelNumber;
    if (serialNumber !== undefined) asset.serialNumber = serialNumber;
    if (purchaseDate) asset.purchaseDate = new Date(purchaseDate);
    if (warrantyExpiration) asset.warrantyExpiration = new Date(warrantyExpiration);
    if (cost !== undefined) asset.cost = parseFloat(cost);
    if (notes !== undefined) asset.notes = notes;

    const updatedAsset = await asset.save();
    const populated = await Asset.findById(updatedAsset._id)
      .populate("assignedTo", "name email role department")
      .populate("department", "name code");

    return res.json(populated);
  } catch (error) {
    console.error("Update Asset Error:", error);
    return res.status(500).json({ message: error.message || "Failed to update asset" });
  }
};

/**
 * @desc    Assign or unassign asset to user / department
 * @route   PATCH /api/assets/:id/assign
 * @access  Private (Asset Manager, IT Manager, Admin)
 */
export const assignAsset = async (req, res) => {
  try {
    const { userId, departmentId } = req.body;

    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Target user not found" });
      }
      asset.assignedTo = user._id;
      asset.status = "assigned";
    } else {
      asset.assignedTo = null;
      asset.status = "in_inventory";
    }

    if (departmentId !== undefined) {
      if (departmentId) {
        const dept = await Department.findById(departmentId);
        if (!dept) {
          return res.status(404).json({ message: "Target department not found" });
        }
        asset.department = dept._id;
      } else {
        asset.department = null;
      }
    }

    const updatedAsset = await asset.save();
    const populated = await Asset.findById(updatedAsset._id)
      .populate("assignedTo", "name email role department")
      .populate("department", "name code");

    return res.json(populated);
  } catch (error) {
    console.error("Assign Asset Error:", error);
    return res.status(500).json({ message: error.message || "Failed to assign asset" });
  }
};

/**
 * @desc    Update asset lifecycle status
 * @route   PATCH /api/assets/:id/status
 * @access  Private (Asset Manager, Tech, Admin)
 */
export const updateAssetStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ALLOWED_STATUSES = ["in_inventory", "assigned", "under_repair", "retired"];

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed statuses: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    asset.status = status;

    // If marked retired, automatically clear active assignment
    if (status === "retired") {
      asset.assignedTo = null;
    }

    const updatedAsset = await asset.save();
    const populated = await Asset.findById(updatedAsset._id)
      .populate("assignedTo", "name email role department")
      .populate("department", "name code");

    return res.json(populated);
  } catch (error) {
    console.error("Update Asset Status Error:", error);
    return res.status(500).json({ message: error.message || "Failed to update asset status" });
  }
};

/**
 * @desc    Delete asset record
 * @route   DELETE /api/assets/:id
 * @access  Private (Asset Manager, Admin)
 */
export const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    await asset.deleteOne();

    return res.json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Delete Asset Error:", error);
    return res.status(500).json({ message: error.message || "Failed to delete asset" });
  }
};

import Department from "../models/departmentModel.js";
import User from "../models/userModel.js";

/**
 * @desc    Create a new department
 * @route   POST /api/departments
 * @access  Private (System Admin, IT Manager)
 */
export const createDepartment = async (req, res) => {
  try {
    const { name, description, manager } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    const deptExists = await Department.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (deptExists) {
      return res.status(400).json({ message: "Department with this name already exists" });
    }

    if (manager) {
      const managerUser = await User.findById(manager);
      if (!managerUser) {
        return res.status(404).json({ message: "Assigned manager user not found" });
      }
    }

    const department = await Department.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      manager: manager || null,
    });

    const populated = await Department.findById(department._id).populate(
      "manager",
      "name email role"
    );

    return res.status(201).json(populated);
  } catch (error) {
    console.error("Create Department Error:", error);
    return res.status(500).json({ message: error.message || "Failed to create department" });
  }
};

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private
 */
export const getDepartments = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const departments = await Department.find(query)
      .populate("manager", "name email role")
      .sort({ name: 1 });

    return res.json(departments);
  } catch (error) {
    console.error("Get Departments Error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch departments" });
  }
};

/**
 * @desc    Get department by ID
 * @route   GET /api/departments/:id
 * @access  Private
 */
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      "manager",
      "name email role"
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Count users in department
    const userCount = await User.countDocuments({ department: department._id });

    return res.json({
      ...department.toObject(),
      userCount,
    });
  } catch (error) {
    console.error("Get Department By ID Error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch department" });
  }
};

/**
 * @desc    Update department details
 * @route   PUT /api/departments/:id
 * @access  Private (System Admin, IT Manager)
 */
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const { name, description, manager, isActive } = req.body;

    if (name) {
      const exists = await Department.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: department._id },
      });
      if (exists) {
        return res.status(400).json({ message: "Another department already has this name" });
      }
      department.name = name.trim();
    }

    if (description !== undefined) department.description = description.trim();
    if (isActive !== undefined) department.isActive = Boolean(isActive);

    if (manager !== undefined) {
      if (manager) {
        const managerUser = await User.findById(manager);
        if (!managerUser) {
          return res.status(404).json({ message: "Assigned manager user not found" });
        }
        department.manager = managerUser._id;
      } else {
        department.manager = null;
      }
    }

    const updated = await department.save();
    const populated = await Department.findById(updated._id).populate(
      "manager",
      "name email role"
    );

    return res.json(populated);
  } catch (error) {
    console.error("Update Department Error:", error);
    return res.status(500).json({ message: error.message || "Failed to update department" });
  }
};

/**
 * @desc    Delete department
 * @route   DELETE /api/departments/:id
 * @access  Private (System Admin)
 */
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Unassign users in this department
    await User.updateMany({ department: department._id }, { department: null });

    await department.deleteOne();

    return res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Delete Department Error:", error);
    return res.status(500).json({ message: error.message || "Failed to delete department" });
  }
};

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Department from "../models/departmentModel.js";

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Helper function to send token response with HTTP-only cookie
const sendTokenResponse = (user, statusCode, res, includeTokenInBody = true) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  const responseBody = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    isActive: user.isActive,
  };

  if (includeTokenInBody) {
    responseBody.token = token;
  }

  res
    .status(statusCode)
    .cookie("jwt", token, cookieOptions)
    .json(responseBody);
};

const ALLOWED_ROLES = [
  "system_admin",
  "it_manager",
  "technician",
  "employee",
  "asset_manager",
];

// Helper to resolve or create a valid department ObjectId
const resolveDepartmentId = async (deptInput) => {
  if (!deptInput) return null;
  const trimmed = typeof deptInput === "string" ? deptInput.trim() : "";
  if (!trimmed || trimmed === "none") return null;

  // 1. If it's already a valid ObjectId, verify if it exists
  if (mongoose.Types.ObjectId.isValid(trimmed)) {
    const existingById = await Department.findById(trimmed);
    if (existingById) return existingById._id;
  }

  // 2. Find by name case-insensitive
  const existingByName = await Department.findOne({
    name: { $regex: new RegExp(`^${trimmed}$`, "i") },
  });

  if (existingByName) {
    return existingByName._id;
  }

  // 3. If department does not exist yet, auto-create it so userModel reference remains valid
  try {
    const createdDept = await Department.create({
      name: trimmed,
      description: `${trimmed} Department`,
    });
    return createdDept._id;
  } catch (err) {
    console.warn("Could not create department dynamically:", err.message);
    return null;
  }
};

/**
 * @desc    Get public active departments list for registration & onboarding
 * @route   GET /api/auth/departments
 * @access  Public
 */
export const getPublicDepartments = async (req, res) => {
  try {
    let departments = await Department.find({ isActive: { $ne: false } })
      .select("name description _id")
      .sort({ name: 1 });

    if (!departments || departments.length === 0) {
      const defaultNames = [
        "Product & Engineering",
        "IT Operations",
        "Human Resources",
        "Finance & Operations",
        "Customer Support",
        "Security & Compliance",
      ];

      departments = await Promise.all(
        defaultNames.map(async (name) => {
          let dept = await Department.findOne({ name });
          if (!dept) {
            dept = await Department.create({
              name,
              description: `${name} Department`,
              isActive: true,
            });
          }
          return dept;
        })
      );
    }

    return res.json(departments);
  } catch (error) {
    console.error("Fetch Departments Error:", error);
    return res.status(500).json({ message: "Failed to fetch departments" });
  }
};

/**
 * @desc    Register a new user with specified role & set HTTP-only cookie
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate role if specified
    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        message: `Invalid role specified. Allowed roles: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Safely resolve department to a Department ObjectId (or null)
    const departmentId = await resolveDepartmentId(department);

    // Hash password directly in controller
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "employee",
      department: departmentId,
    });

    if (user) {
      const populatedUser = await User.findById(user._id)
        .select("-password")
        .populate("department", "name description");

      sendTokenResponse(populatedUser, 201, res, true);
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: error.message || "Server error during registration" });
  }
};

/**
 * @desc    Authenticate user & set HTTP-only cookie
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Check for user email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Compare password directly using bcrypt in login route controller
    const isPasswordMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (user && isPasswordMatch) {
      if (!user.isActive) {
        return res.status(403).json({ message: "Account is deactivated. Please contact administrator." });
      }

      const populatedUser = await User.findById(user._id)
        .select("-password")
        .populate("department", "name description");

      sendTokenResponse(populatedUser, 200, res);
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: error.message || "Server error during login" });
  }
};

/**
 * @desc    Logout user & clear JWT cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: error.message || "Server error during logout" });
  }
};

/**
 * @desc    Get logged in user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("department");

    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};


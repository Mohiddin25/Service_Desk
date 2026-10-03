import Ticket from "../models/ticketModel.js";
import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";

/**
 * Helper function to generate unique ticket numbers (e.g. TCK-20260916-A1B2)
 */
const generateTicketNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TCK-${dateStr}-${randomHex}`;
};

/**
 * @desc    Create a new ticket
 * @route   POST /api/tickets
 * @access  Private
 */
export const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let ticketNumber = generateTicketNumber();
    // Ensure uniqueness
    let exists = await Ticket.findOne({ ticketNumber });
    while (exists) {
      ticketNumber = generateTicketNumber();
      exists = await Ticket.findOne({ ticketNumber });
    }

    const ticket = await Ticket.create({
      ticketNumber,
      title,
      description,
      category: category || "other",
      priority: priority || "medium",
      status: "open",
      createdBy: req.user._id,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("createdBy", "name email role department")
      .populate("assignedTo", "name email role");

    return res.status(201).json(populatedTicket);
  } catch (error) {
    console.error("Create Ticket Error:", error);
    return res.status(500).json({ message: error.message || "Failed to create ticket" });
  }
};

/**
 * @desc    Get all tickets with role-based scoping, pagination, search & filters
 * @route   GET /api/tickets
 * @access  Private
 */
export const getTickets = async (req, res) => {
  try {
    const { status, priority, category, search, page = 1, limit = 10 } = req.query;

    const query = {};

    // Role-based access control scoping
    if (req.user.role === "employee") {
      // Employees can only see tickets they created
      query.createdBy = req.user._id;
    } else if (req.user.role === "technician") {
      // Technicians see tickets assigned to them OR open/unassigned tickets
      query.$or = [
        { assignedTo: req.user._id },
        { assignedTo: null },
      ];
    }
    // IT Managers & System Admins see all tickets by default

    // Status filter
    if (status) {
      query.status = status;
    }

    // Priority filter
    if (priority) {
      query.priority = priority;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Search term (title, description, or ticketNumber)
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { ticketNumber: { $regex: search, $options: "i" } },
        ],
      });
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .populate("createdBy", "name email role department")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.json({
      tickets,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error("Get Tickets Error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch tickets" });
  }
};

/**
 * @desc    Get ticket by ID
 * @route   GET /api/tickets/:id
 * @access  Private
 */
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name email role department")
      .populate("assignedTo", "name email role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Employee security check: employees can only view their own tickets
    if (
      req.user.role === "employee" &&
      ticket.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to view this ticket" });
    }

    return res.json(ticket);
  } catch (error) {
    console.error("Get Ticket By ID Error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch ticket" });
  }
};

/**
 * @desc    Update ticket (title, description, priority, category)
 * @route   PUT /api/tickets/:id
 * @access  Private
 */
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Security check: Employee can only edit their own OPEN tickets
    if (req.user.role === "employee") {
      if (ticket.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this ticket" });
      }
      if (ticket.status !== "open") {
        return res.status(400).json({ message: "Cannot edit ticket after it has been assigned or processed" });
      }
    }

    const { title, description, category, priority } = req.body;

    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (category) ticket.category = category;
    if (priority) ticket.priority = priority;

    const updatedTicket = await ticket.save();
    const populated = await Ticket.findById(updatedTicket._id)
      .populate("createdBy", "name email role department")
      .populate("assignedTo", "name email role");

    return res.json(populated);
  } catch (error) {
    console.error("Update Ticket Error:", error);
    return res.status(500).json({ message: error.message || "Failed to update ticket" });
  }
};

/**
 * @desc    Assign ticket to technician or self
 * @route   PATCH /api/tickets/:id/assign
 * @access  Private (IT Manager, Admin, Technician)
 */
export const assignTicket = async (req, res) => {
  try {
    const { technicianId } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const targetTechId = technicianId || req.user._id;

    // Verify assigned user exists and has valid role
    const technician = await User.findById(targetTechId);
    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    if (!["technician", "it_manager", "system_admin"].includes(technician.role)) {
      return res.status(400).json({ message: "Assigned user must be a technician or manager" });
    }

    ticket.assignedTo = targetTechId;

    // Auto update status to 'assigned' if currently 'open'
    if (ticket.status === "open") {
      ticket.status = "assigned";
    }

    const updatedTicket = await ticket.save();
    const populated = await Ticket.findById(updatedTicket._id)
      .populate("createdBy", "name email role department")
      .populate("assignedTo", "name email role");

    return res.json(populated);
  } catch (error) {
    console.error("Assign Ticket Error:", error);
    return res.status(500).json({ message: error.message || "Failed to assign ticket" });
  }
};

/**
 * @desc    Update ticket status (open, assigned, in_progress, resolved, closed, reopened)
 * @route   PATCH /api/tickets/:id/status
 * @access  Private
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ALLOWED_STATUSES = ["open", "assigned", "in_progress", "resolved", "closed", "reopened"];

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed statuses: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Role checks on status updates
    if (req.user.role === "employee") {
      // Employees can only mark their own ticket as 'closed' or 'reopened' if resolved
      if (ticket.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to change status of this ticket" });
      }
      if (!["closed", "reopened"].includes(status)) {
        return res.status(403).json({ message: "Employees can only close or reopen resolved tickets" });
      }
    }

    // Handle timestamp updates automatically
    const now = new Date();

    if (status === "in_progress" && !ticket.firstRespondedAt) {
      ticket.firstRespondedAt = now;
    }

    if (status === "resolved") {
      if (!ticket.firstRespondedAt) {
        ticket.firstRespondedAt = now;
      }
      ticket.resolvedAt = now;
    }

    if (status === "closed") {
      ticket.closedAt = now;
    }

    if (status === "reopened") {
      ticket.resolvedAt = null;
      ticket.closedAt = null;
    }

    ticket.status = status;

    const updatedTicket = await ticket.save();
    const populated = await Ticket.findById(updatedTicket._id)
      .populate("createdBy", "name email role department")
      .populate("assignedTo", "name email role");

    return res.json(populated);
  } catch (error) {
    console.error("Update Ticket Status Error:", error);
    return res.status(500).json({ message: error.message || "Failed to update ticket status" });
  }
};

/**
 * @desc    Add a comment / work log to a ticket
 * @route   POST /api/tickets/:id/comments
 * @access  Private
 */
export const addTicketComment = async (req, res) => {
  try {
    const { message, isInternal } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Comment message is required" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Employee authorization check
    if (
      req.user.role === "employee" &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to comment on this ticket" });
    }

    // Employees cannot post internal comments
    const internalFlag = req.user.role === "employee" ? false : Boolean(isInternal);

    const comment = await Comment.create({
      ticket: ticket._id,
      user: req.user._id,
      message,
      isInternal: internalFlag,
    });

    // If first technician/manager comment, set firstRespondedAt timestamp on ticket if not set
    if (
      ["technician", "it_manager", "system_admin"].includes(req.user.role) &&
      !ticket.firstRespondedAt
    ) {
      ticket.firstRespondedAt = new Date();
      await ticket.save();
    }

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "name email role"
    );

    return res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Add Ticket Comment Error:", error);
    return res.status(500).json({ message: error.message || "Failed to add comment" });
  }
};

/**
 * @desc    Get all comments for a ticket
 * @route   GET /api/tickets/:id/comments
 * @access  Private
 */
export const getTicketComments = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Employee authorization check
    if (
      req.user.role === "employee" &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to view comments for this ticket" });
    }

    const query = { ticket: ticket._id };

    // Employees cannot see internal work log comments
    if (req.user.role === "employee") {
      query.isInternal = false;
    }

    const comments = await Comment.find(query)
      .populate("user", "name email role")
      .sort({ createdAt: 1 });

    return res.json(comments);
  } catch (error) {
    console.error("Get Ticket Comments Error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch comments" });
  }
};

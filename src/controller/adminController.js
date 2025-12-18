import User from "../mongoDb/models/user-model.js";

export const getUserRoleCounts = async (req, res) => {
  try {
    const roleCounts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);
    const counts = {
      superadmins: 0,
      admins: 0,
      users: 0,
    };

    roleCounts.forEach((item) => {
      if (item._id === "superadmin") counts.superadmins = item.count;
      else if (item._id === "admin") counts.admins = item.count;
      else if (item._id === "user") counts.users = item.count;
    });

    res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error("Error fetching user role counts:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user role counts",
    });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admins",
    });
  }
};




export const removeAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({ message: "adminId is required" });
    }

    const user = await User.findById(adminId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "super_admin") {
      return res.status(403).json({
        message: "Cannot remove super admin role",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        message: "User is not an admin",
      });
    }

    user.role = "user";
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Admin role removed successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("removeAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while removing admin",
    });
  }
};






export const setRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      return res.status(400).json({ message: "userId and role are required" });
    }

    const allowedRoles = ["user", "admin", "super_admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Target user not found" });
    }
    user.role = role;
    await user.save();
    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({ message: "Role updated", user: userWithoutPassword });
  } catch (error) {
    console.error("setRole error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    // Query params
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 25, 100); // max 100 per page
    const skip = (page - 1) * limit;

    const { role, q, sortBy } = req.query;
    const filter = {};

    if (role) {
      // only allow valid roles
      const allowedRoles = ["user", "admin", "super_admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role filter" });
      }
      filter.role = role;
    }

    if (q) {
      // simple text search on fullName and email
      filter.$or = [
        { fullName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    // Sorting
    let sort = { createdAt: -1 }; // default: newest first
    if (sortBy === "name") sort = { fullName: 1 };
    if (sortBy === "oldest") sort = { createdAt: 1 };

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      users,
      meta: { total, page, totalPages, limit },
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
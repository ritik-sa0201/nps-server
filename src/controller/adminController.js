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

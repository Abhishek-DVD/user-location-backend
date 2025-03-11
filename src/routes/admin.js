const express = require("express");
const User = require("../models/user");
const Location = require("../models/location");
const { adminAuth } = require("../middlewares/auth");
const adminRouter = express.Router();

adminRouter.get("/admin/users", adminAuth, async (req, res) => {
    try {
        const adminUser = req.user;

        // Pagination (/admin/users?page=1&limit=10)
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: "Invalid parameters, soch samajh kr bhj bhai." });
        }

        const totalUsers = await User.countDocuments({ _id: { $ne: adminUser._id } });
        const skip = (page - 1) * limit;

        const users = await User.find({ _id: { $ne: adminUser._id } })
            .select("-password")
            .skip(skip)
            .limit(limit);

        res.json({
            message: "Users fetched successfully",
            data: users,
            pagination: {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                limitPerPage: limit
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
});


adminRouter.get("/admin/user-location/:userId", adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the latest location for the user
        const location = await Location.findOne({ userId });

        if (!location) {
            return res.status(404).json({ message: "No location found for this user." });
        }

        res.json({ message: "Latest location fetched successfully", data: location });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user location", error: err.message });
    }
});

adminRouter.get("/admin/user/:userId", adminAuth, async (req, res) => {
    const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching user.",
    });
  }
})

module.exports = adminRouter;
const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Location = require("../models/location");
const locationRouter = express.Router();

// Update user's latest location
locationRouter.post("/location/update", userAuth, async (req, res) => {
  try {
    const { latitude, longitude, accuracy, speed, deviceInfo, address } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and Longitude are required." });
    }

    const userId = req.user._id;

    // Update the latest location instead of creating a new entry
    const location = await Location.findOneAndUpdate(
      { userId },
      { latitude, longitude, accuracy, speed, deviceInfo, address },
      { new: true, upsert: true } // Create if not exists, otherwise update
    );

    res.status(200).json({ message: "Location Updated Successfully", data: location });
  } catch (err) {
    res.status(500).json({ message: "Error updating location", error: err.message });
  }
});

module.exports = locationRouter;

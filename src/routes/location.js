const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Location = require("../models/location");
const redis = require("../utils/redisClient");
const locationRouter = express.Router();

const UAParser = require("ua-parser-js");
const getLocationDetails = require("../utils/getLocationDetails");
const parser = new UAParser();

// Update user's latest location
locationRouter.put("/location/update", userAuth, async (req, res) => {
  try {
    const { latitude, longitude, accuracy, speed} = req.body;

    // for getting device info
    const userAgent = req.headers["user-agent"];
    const uaResult = parser.setUA(userAgent).getResult();
    const deviceInfo = {
      browser: uaResult.browser.name || "N/A",
      os: uaResult.os.name || "N/A",
      device: uaResult.device.model || "Desktop",
      vendor: uaResult.device.vendor || "Unknown"
    };

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and Longitude are required." });
    }

    //reverse geo coding
    const geoData = await getLocationDetails(latitude,longitude);
    console.log(geoData);
    const address = {
      country : geoData.country || "N/A",
      state : geoData.state || "N/A",
      city : geoData.city || "N/A",
      postcode : geoData.postcode || "N/A"
    }

    const userId = req.user._id;

    // Update the latest location instead of creating a new entry
    const location = await Location.findOneAndUpdate(
      { userId },
      { latitude, longitude, accuracy, speed, deviceInfo, address},
      { new: true, upsert: true } // Create if not exists, otherwise update
    );

    //invalidate redis cache
    //as the location has been updated,so the cache is no longer valid

    const redisKey = `userLocation:${userId}`;
    await redis.del(redisKey);
    console.log("Cache invalidated for userId : ",userId);

    res.status(200).json({ message: "Location Updated Successfully", data: location });
  } catch (err) {
    res.status(500).json({ message: "Error updating location", error: err.message });
  }
});

module.exports = locationRouter;

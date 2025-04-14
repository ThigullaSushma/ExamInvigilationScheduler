const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Schedule = require("../model/Schedule");

router.get("/getcurrentschedule", async (req, res) => {
  try {
    const currentDate = new Date();

    let data = await Schedule.find({
      EndDate: { $gte: currentDate.toISOString().split("T")[0] },
    });

    if (data.length === 0) {
      return res.status(404).json([]);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error while fetching current schedule:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/allschedule", async (req, res) => {
  try {
    const currentDate = new Date();

    let data = await Schedule.find();

    if (data.length === 0) {
      return res.status(404).json([]);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error while fetching current schedule:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

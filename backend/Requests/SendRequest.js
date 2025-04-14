const model = require("../model/Facultyschedule");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/sendrequest", async (req, res) => {
  try {
    // Fetch the faculty record with the given EmployeeId
    console.log(req.body)
    const data = await model.findOne({ EmployeeId: req.body.EmployeeId });
    
    if (!data) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    if (!data.InvigilationDuties || data.InvigilationDuties.length === 0) {
      return res.status(400).json({ message: "No invigilation duties found" });
    }

    // Flag to check if any update happened
    let isUpdated = false;

    // Updating the request status for the given duty ID
    data.InvigilationDuties = data.InvigilationDuties.map((duty) => {
      if (duty.Id === req.body.Id) {
        duty.Request = true;
        isUpdated = true;
      }
      return duty;
    });

    // If no update was made, return early to avoid unnecessary save()
    if (!isUpdated) {
      return res.status(400).json({ message: "No matching duty found" });
    }

    // Mark InvigilationDuties as modified to ensure Mongoose saves it
    data.markModified("InvigilationDuties");

    // Save the updated document
    await data.save();

    return res.status(200).json({ message: "Request updated successfully" });
  } catch (err) {
    console.log("Error occurred:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;

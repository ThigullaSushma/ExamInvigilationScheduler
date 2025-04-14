const express = require("express");
const router = express.Router();
const facreq = require("../model/FacultyRequest");

const semStart = "2025-01-01";
const semEnd = "2025-05-20";

router.post("/fine", async (req, res) => {
  try {
    const data = await facreq.findOne({ EmployeeId: "EMP0001" });

    if (!data) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Filter requests based on conditions
    const filteredRequests = data.Requests.filter(
      (req) =>
        req.date >= semStart && req.date <= semEnd && req.status === "true"
    );

    console.log(filteredRequests);
    return res.status(200).json(filteredRequests);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

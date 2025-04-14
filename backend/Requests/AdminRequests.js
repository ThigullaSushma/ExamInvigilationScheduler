const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const AdminRequest = require("../model/AdminRequest");
const FacultyRequest = require("../model/FacultyRequest");
const Schedule = require("../model/Schedule");

router.post("/AdminRequest", async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const length = await AdminRequest.find().session(session);

    let temp = new AdminRequest({
      No: length.length + 1,
      RequestDate: new Date().toISOString().split("T")[0],
      Data: req.body.data,
      EmployeeId: req.body.EmployeeId,
      Status: req.body.Status,
      ScheduleNo: req.body.ScheduleNo,
      Indexes: req.body.Indexes,
    });

    await temp.save({ session }); // First save

    let facreq = await FacultyRequest.findOne({
      EmployeeId: req.body.EmployeeId,
    }).session(session);

    if (!facreq) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send({ message: "No Faculty Request found" });
    }

    const table = await Schedule.findOne({
      ScheduleNo: req.body.ScheduleNo,
    }).session(session);

    if (!table) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "No matching schedule found" });
    }

    const [row, col] = req.body.Indexes;
    const data = {
      reason: req.body.data,
      date: table.ScheduleTimings[col].split(" ")[0],
      room: table.RoomDetails[row],
      session: table.ScheduleTimings[col].split(" ")[1],
      status: req.body.Status,
    };

    facreq.Requests.push(data);
    const requestIndex = facreq.Requests.length - 1; // Get the index of newly added request
    await facreq.save({ session });

    // Update AdminRequest with FacultyRequestIndex
    await AdminRequest.findByIdAndUpdate(
      temp._id, // ✅ Correct - temp._id is an ObjectId
      { FacultyRequestIndex: requestIndex },
      { session, new: true }
    );

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .send({ message: "Transaction successful", data, requestIndex });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).send({ "error occurred": err });
  }
});

router.get("/GetAdminRequests", async (req, res) => {
  try {
    const requests = await AdminRequest.find();

    res.status(200).json(requests.filter((a) => a.Status === "Pending"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

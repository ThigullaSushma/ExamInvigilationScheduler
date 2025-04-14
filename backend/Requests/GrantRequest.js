const model = require("../model/AdminRequest");
const facreq = require("../model/FacultyRequest");
const schedule = require("../model/Schedule");
const facultyschedule = require("../model/Facultyschedule");
const details=require("../model/Model")
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const axios = require("axios");

router.post("/grantrequest", async (req, res) => {
  try {
    console.log(req.body);

    const { No, EmployeeId, ScheduleNo, Index, FacultyRequestIndex, check } =
      req.body;

    const data = await model.findOne({ No });
    const facultyrequest = await facreq.findOne({ EmployeeId });

    if (!data) return res.status(404).json({ message: "Request not found" });
    if (!facultyrequest)
      return res.status(404).json({ message: "Faculty request not found" });

    // Fetch faculty details for email
    const facultyRecord = await details.findOne({ EmployeeId });
    const facultyEmail = facultyRecord?.email;
    const facultyName = facultyRecord?.name;

    if (!check) {
      // **❌ Request Denied: Send Rejection Email**
      facultyrequest.Requests[FacultyRequestIndex].status = "false";
      facultyrequest.markModified("Requests");
      data.Status = "false";

      await Promise.all([data.save(), facultyrequest.save()]);

      // Send rejection email
      if (facultyEmail) {
         if (facultyEmail) {
           await axios.post("http://localhost:5000/send", {
             to: facultyEmail,
             subject: "❌ Invigilation Duty Request Denied",
             text: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #e74c3c;">❌ Invigilation Duty Request Denied</h2>
        <p>Dear <strong>${facultyName}</strong>,</p>
        <p>Your request for <b>duty Unchange</b> on:</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><b>📅 Date:</b></td>
            <td style="border: 1px solid #ddd; padding: 8px;">
              ${facultyrequest.Requests[FacultyRequestIndex].date}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><b>⏰ Session:</b></td>
            <td style="border: 1px solid #ddd; padding: 8px;">
              ${facultyrequest.Requests[FacultyRequestIndex].session}
            </td>
          </tr>

          <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>🏫 Room:</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${facultyrequest.Requests[FacultyRequestIndex].room}</td>
        </tr>
          
        </table>
        <p style="color: red;"><b>Your request has been denied.</b></p>
        <p>If you need further clarification, please contact the admin team.</p>
        <p style="margin-top: 20px;">Best regards,</p>
        <p><b>Admin Team</b></p>
      </div>
    `,
           });
         }

      }

      return res.status(200).json({ message: "Request denied", data });
    }

    // **✅ Request Granted: Reassigning Faculty**
    if (!ScheduleNo || !Array.isArray(Index) || Index.length !== 2) {
      return res
        .status(400)
        .json({ message: "Invalid ScheduleNo or Index format" });
    }

    const [row, col] = Index;
    const table = await schedule.findOne({ ScheduleNo });

    if (!table)
      return res.status(404).json({ message: "No matching schedule found" });

    const response = await fetch("http://localhost:5000/invigilationdetails");
    if (!response.ok)
      return res
        .status(500)
        .json({ message: "Failed to fetch invigilation details" });

    const invigilationdetails = await response.json();
    if (!invigilationdetails.length)
      return res.status(404).json({ message: "No invigilation details found" });

    invigilationdetails.sort(
      (a, b) =>
        (a.InvigilationDuties.length || 0) - (b.InvigilationDuties.length || 0)
    );

    let newEmployeeId = null;
    let k = 0;

    while (k < invigilationdetails.length) {
      const curr = await facreq.findOne({
        EmployeeId: invigilationdetails[k].EmployeeId,
      });

      if (
        !curr?.Requests?.some(
          (leave) => leave.date === table.ScheduleTimings[col].split("T")[0]
        )
      ) {
        newEmployeeId = invigilationdetails[k].EmployeeId;
        break;
      }
      k++;
    }

    if (!newEmployeeId) {
      return res.status(400).json({ message: "No available faculty found" });
    }

    const originalId = table.Assignment[row][col];
    table.Assignment[row][col] = newEmployeeId;

    const faculty = await facultyschedule.findOne({
      EmployeeId: newEmployeeId,
    });
    if (!faculty)
      return res.status(404).json({ message: "Faculty schedule not found" });

    faculty.InvigilationDuties.push({
      date: table.ScheduleTimings[col].split(" ")[0],
      room: table.RoomDetails[row],
      session: table.ScheduleTimings[col].split(" ")[1],
      Id: faculty.InvigilationDuties.length + 1,
      Request: false,
      ScheduleNo,
      Row: row,
      Col: col,
    });

    const remove = await facultyschedule.findOne({ EmployeeId: originalId });
    if (remove?.InvigilationDuties.length > 0) {
      remove.InvigilationDuties.pop();
    }

    facultyrequest.Requests[FacultyRequestIndex].status = "true";
    facultyrequest.markModified("Requests");

    data.Status = "true";

    await Promise.all([
      faculty.save(),
      table.save(),
      data.save(),
      facultyrequest.save(),
      remove ? remove.save() : null,
    ]);

    // **✅ Send Email Notifications**
    // 1️⃣ Email to the faculty whose request was approved
    if (facultyEmail) {
      axios.post("http://localhost:5000/send", {
        to: facultyEmail,
        subject: "✅ Invigilation Duty Request Approved",
        text: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">✅ Invigilation Duty Request Approved</h2>
      <p>Dear <strong>${facultyName} your request approved see.below details</strong></p>
      <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>📅 Date:</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">
            ${facultyrequest.Requests[FacultyRequestIndex].date}
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>⏰ Session:</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">
            ${facultyrequest.Requests[FacultyRequestIndex].session}
          </td>
        </tr>
         <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>🏫 Room:</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${facultyrequest.Requests[FacultyRequestIndex].room}</td>
        </tr>
      </table>
      <p>has been <b style="color: green;">approved</b>. You have been removed from your assigned duty.</p>
      <p style="margin-top: 20px;">Best regards,</p>
      <p><b>Admin Team</b></p>
    </div>
  `,
      });
    }

    // 2️⃣ Email to the newly assigned faculty
    const newFacultyRecord = await details.findOne({
      EmployeeId: newEmployeeId,
    });
    const newFacultyEmail = newFacultyRecord?.email;
    const newFacultyName = newFacultyRecord?.name;

    if (newFacultyEmail) {
       axios.post("http://localhost:5000/send", {
        to: newFacultyEmail,
        subject: "New Invigilation Duty Assigned",
        text: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">📢 Invigilation Duty Assignment</h2>
      <p>Dear <strong>${newFacultyName}</strong>,</p>
      <p>You have been assigned <b>invigilation duty</b> as per the details below:</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>📅 Date:</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            table.ScheduleTimings[col].split(" ")[0]
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>🏫 Room:</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            table.RoomDetails[row]
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>⏰ Session:</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            table.ScheduleTimings[col].split(" ")[1]
          }</td>
        </tr>
      </table>
      <p>For any queries, feel free to contact the admin team.</p>
      <p style="margin-top: 20px;">Best regards,</p>
      <p><b>Admin Team</b></p>
    </div>
  `,
      });
    }

    return res.status(200).json({ message: "Request granted", data, table });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;

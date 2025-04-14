const http = require("http");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const CreateSchedule = require("../model/Schedule");
const InvigilationDuties = require("../model/Facultyschedule");
const facreq = require("../model/FacultyRequest");
const details=require("../model/Model")
const axios=require("axios")
// Function to fetch invigilation details
async function generateschedule() {
  return new Promise((resolve, reject) => {
    const req = http.get("http://localhost:5000/invigilationdetails", (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error("Failed to parse JSON response"));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
}

// Function to create the assignment matrix
async function createScheduleMatrix(days, rooms, facultyData) {
  let scheduleMatrix = Array.from({ length: days.length }, () =>
    new Array(rooms.length).fill(null)
  );

  let facultyIndex = 0;

  for (let i = 0; i < days.length; i++) {
    for (let j = 0; j < rooms.length; j++) {
      let assigned = false;

      for (let k = 0; k < facultyData.length; k++) {
        const faculty = facultyData[(facultyIndex + k) % facultyData.length];

        const facultyRequest = await facreq.findOne({
          EmployeeId: faculty.EmployeeId,
        });
        const isOnLeave = facultyRequest?.Requests?.some(
          (leave) => leave.date === days[i].date
        );

        if (!isOnLeave) {
          scheduleMatrix[i][j] = faculty.EmployeeId;
          facultyIndex = (facultyIndex + k + 1) % facultyData.length;
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        scheduleMatrix[i][j] = "Unassigned";
      }
    }
  }
  return scheduleMatrix;
}

// Function to update invigilation duties
async function updateInvigilationDatabase(
  session,
  assignmentMatrix,
  days,
  rooms,
  ScheduleNo
) {
  try {
    console.log(days,rooms);
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < rooms.length; j++) {
        let facultyId = assignmentMatrix[i][j];

        if (facultyId !== "Unassigned") {
          let facultyRecord = await InvigilationDuties.findOne({
            EmployeeId: facultyId,
          });
          let facdata = await details.findOne({
            EmployeeId: facultyId,
          });

          let facultyEmail = facdata?.email;
          let facultyName = facdata?.name;
          let currentDutyCount = facultyRecord
            ? facultyRecord.InvigilationDuties.length
            : 0;

          await InvigilationDuties.findOneAndUpdate(
            { EmployeeId: facultyId },
            {
              $push: {
                InvigilationDuties: {
                  Id: currentDutyCount + 1,
                  date: days[i].date,
                  room: rooms[j],
                  session: days[i].session,
                  Request: false,
                  ScheduleNo: ScheduleNo,
                  Row: i,
                  Col: j,
                },
              },
            },
            { upsert: true, new: true, session }
          );

          // Send email using the route
          if (facultyEmail) {
            try {
               axios.post("http://localhost:5000/send", {
                 to: facultyEmail,
                 subject: "📢 Invigilation Duty Assignment",
                 text: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">📢 Invigilation Duty Assignment</h2>
      <p>Dear <strong>${facultyName}</strong>,</p>
      <p>You have been assigned <b>invigilation duty</b> as per the details below:</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>📅 Date:</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${days[i].date}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>🏫 Room:</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${rooms[j]}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;"><b>⏰ Session:</b></td>
          <td style="border: 1px solid #ddd; padding: 8px;">${days[i].session}</td>
        </tr>
      </table>
      <p>For any queries, feel free to contact the admin team.</p>
      <p style="margin-top: 20px;">Best regards,</p>
      <p><b>Admin Team</b></p>
    </div>
  `,
               });

              console.log(`✅ Email sent to ${facultyEmail}`);
            } catch (emailError) {
              console.error(
                `❌ Failed to send email to ${facultyEmail}: ${emailError.message}`
              );
            }
          }
        }
      }
    }
  } catch (error) {
    throw new Error(
      "Error updating invigilation duties database: " + error.message
    );
  }
}

// Route to create schedule
router.post("/createschedule", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const scheduleCount = await CreateSchedule.countDocuments();
    const scheduleNo = scheduleCount + 1;

    const scheduleData = {
      ScheduleExamName: req.body.ScheduleExamName,
      StartDate: req.body.Days[0].date,
      EndDate: req.body.Days[req.body.Days.length - 1].date,
      ScheduleTimings: req.body.Days.map((a) => `${a.date} ${a.session}`),
      RoomDetails: req.body.Room,
      ScheduleNo: scheduleNo,
    };

    let facultyData = await generateschedule();
    facultyData.sort(
      (a, b) => a.InvigilationDuties.length - b.InvigilationDuties.length
    );

    if (!facultyData.length) throw new Error("No faculty data available");

    scheduleData.Assignment = await createScheduleMatrix(
      req.body.Days,
      req.body.Room,
      facultyData
    );

    const finalSchedule = new CreateSchedule(scheduleData);
    await finalSchedule.save({ session });

    await updateInvigilationDatabase(
      session,
      scheduleData.Assignment,
      req.body.Days,
      req.body.Room,
      scheduleNo
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).send("Scheduled successfully");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error:", err);
    return res.status(500).json({
      message: "There was an issue while creating the schedule",
      error: err.message,
    });
  }
});

module.exports = router;

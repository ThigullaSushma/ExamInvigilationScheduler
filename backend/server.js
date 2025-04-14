const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
// const RegisterUser=require("./model/Model")
const addfacultyroute=require("../backend/Admin/AddFaculty")
const updatefacultyroute=require('../backend/Admin/UpdateFaculty')
const deletefacultyroute=require("../backend/Admin/DeleteFaculty")
const adminloginroute = require("./Admin/Login");
const facultydata=require("./Admin/GetData")
const profile=require("./Admin/GetFacultyProfile")
const updatebyemployee=require("./Admin/UpdateByEmployee")
const FacultySchedule=require("./FacultySchedule/Initilaizeschedule")
const CreateSchedule=require("./FacultySchedule/CreateSchedule")
const getinvgetails=require("./FacultySchedule/GetInvilationdetails")
const getcurrentschedule=require("./FacultySchedule/GetCurrentSchedule")
const getcurrentschedulebyId=require("./FacultySchedule/FcultyCurrentScheduleId")
const intializefacultyrequest=require("./Requests/FacultyRequests");
const AdminRequest=require("./Requests/AdminRequests");
const getrequest=require("./Requests/GetRequests")
const grandrequest=require("./Requests/GrantRequest")
const getduties=require("./Requests/GetDuties")
const sendrequest=require("./Requests/SendRequest")
const raisedrequests=require("./Requests/RaisedRequests")
const finemodule=require("./fine/Finemodule")
const sendmailer=require("./FacultySchedule/mail/Mailsend")

dotenv.config();


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/",addfacultyroute);
app.use("/",updatefacultyroute);
app.use("/",deletefacultyroute);
app.use("/",adminloginroute)
app.use("/",facultydata)
app.use("/",profile)
app.use("/",updatebyemployee)
app.use("/",FacultySchedule);
app.use("/", CreateSchedule);
app.use("/",getinvgetails)
app.use("/",getcurrentschedule);
app.use("/", getcurrentschedulebyId);
app.use("/",intializefacultyrequest)
app.use("/",AdminRequest);
app.use("/",getrequest);
app.use("/",grandrequest);
app.use("/",getduties);
app.use("/",sendrequest)
app.use("/", raisedrequests);
app.use("/", AdminRequest);
app.use("/",sendmailer);
app.use("/",finemodule);

app.listen(5000, () => {
  console.log("Server is running at 5000");
});



/*

app.put("/assign-employee-id", async (req, res) => {
  try {
    const users = await RegisterUser.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No faculty found to update" });
    }

    const updatedUsers = await Promise.all(
      users.map(async (user, index) => {
        const EmployeeId = `EMP${String(index + 1).padStart(4, "0")}`; // Example format: EMP0001, EMP0002
        user.EmployeeId = EmployeeId;
        await user.save();
        return user;
      })
    );

    res.status(200).json({
      message: "Employee IDs assigned successfully",
      users: updatedUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error assigning employee IDs",
      error: error.message,
    });
  }
});
*/
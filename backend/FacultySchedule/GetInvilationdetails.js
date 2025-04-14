const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const FacultySchedule = require("../model/Facultyschedule");

router.get("/invigilationdetails", async (req, res) => {

       const data=await FacultySchedule.find();
       // console.log(data)
       return res.status(200).send(data)
})

module.exports=router;
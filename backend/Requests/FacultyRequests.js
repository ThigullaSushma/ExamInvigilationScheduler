const model=require("../model/FacultyRequest");
const express=require("express");
const router=express.Router();
const mongoose = require("mongoose");
const schedule = require("../model/Schedule");

router.post("/intializefacultyrequest",async (req,res)=>{
   
  try{ 

      
      const facreq=await model.findOne({EmployeeId:req.body.EmployeeId});

       const table = await schedule.findOne({ ScheduleNo: req.body.ScheduleNo });
       console.log(facreq);
       console.log(table)
      
          if (!table) {
            return res.status(404).json({ message: "No matching schedule found" });
          }
            
      const [row, col] = req.body.Indexes;
      const data = {
        reason: req.body.reason,
        date: table.ScheduleTimings[col].split(" ")[0],
        room: table.RoomDetails[row],
        session: table.ScheduleTimings[col].split(" ")[1],
        status: req.body.Status,
      };

      facreq.Requests.push(data);
        await facreq.save();
        return res.status(200).send(data)
  }
  catch(err){
    return res.status(500).send({"error occured":err})
  }

})


router.get("/getfacultyrequest", async (req, res) => {
  try {

    
    const facreq = await model.findOne({ EmployeeId: req.query.EmployeeId });

    
    console.log(facreq);
   

    return res.status(200).send(facreq.Requests);
  } catch (err) {
    return res.status(500).send({ "error occured": err });
  }
});

module.exports=router;


/*
 const response = await fetch("http://localhost:5000/facultydata");
        const data=await response.json();
        console.log(data)
        for(let i of data){
              let temp=new model({
                EmployeeId:i.EmployeeId,
                Requests:[]


              })
              await temp.save();
        }*/
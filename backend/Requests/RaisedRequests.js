const model=require("../model/FacultyRequest");
const express=require("express");
const router=express.Router();
const mongoose = require("mongoose");
// const Schedule = require("../model/Schedule");

router.get("/raisedrequests",async (req,res)=>{
   
   try{
          const EmployeeId=req.query.EmployeeId;
          const data=await model.find({EmployeeId});
          
          
          res.status(200).send(data[0].Requests);

   }
   catch(err){
    console.log("some error occured:",err);
    res.status(500).send(err);
   }
       
})

module.exports=router

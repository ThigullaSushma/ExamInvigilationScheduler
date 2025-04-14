const http = require("http");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();


router.get("/getcurrentschedulebyId/:EmployeeId",async (req,res)=>{


  try{
    //-> we need to send token for verification later
    const response =await fetch("http://localhost:5000/getcurrentschedule");
    const data=await response.json()

    if(data.length==0)return res.status(200).send([]);
    
    const id=req.params.EmployeeId
    for(let w=0;w<data.length;w++){
      let schedule = data[w].Assignment;
    for(let i of schedule){
      for(let k of i){
        
        if(k==id){
             return res.status(200).send([data[w]]);
        }
      }
    }
  }
    return res.status(200).send([]);


  }
  catch(err){
    console.log("error occured in fecting",err);
    return res.status(500).send("some error has been ocuured while fecting",err);
  }
})

module.exports=router
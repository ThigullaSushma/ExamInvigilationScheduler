const express=require("express");
const router=express.Router();
const mongoose = require("mongoose");
const facultyschedule=require("../model/Facultyschedule");

router.post("/getduties/:EmployeeId",async (req,res)=>{
          try{
              
                 const data=await facultyschedule.find({EmployeeId:req.params.EmployeeId});

                
                 return res.status(200).send(data[0].InvigilationDuties.filter(a=>!a.Request));
                    

          }
          catch(err){
            console.log("Error occured",err);
            return res.status(500).send(err);
          }
});
module.exports=router
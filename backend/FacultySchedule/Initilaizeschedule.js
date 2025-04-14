const express=require("express")
const FacultySchedule=require("../model/Facultyschedule")
const router=express.Router()
const registeruser=require("../model/Model")





router.post("/FacultySchedule",async(req,res)=>{

  try{
     let data=await FacultySchedule.find();
      
     
      data.map(async (user,index)=>{
              
            user.InvigilationDuties = [];
            await user.save();

      })
    

      res.status(200).send("created facultyschedule sucessfully");
    }
    catch(err){
      res.status(500).send("error in the adding facultyschedule data");
    }

})
module.exports=router
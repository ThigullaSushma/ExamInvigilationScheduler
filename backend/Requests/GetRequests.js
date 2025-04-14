const model=require("../model/AdminRequest");
const express=require("express");
const router=express.Router();
const mongoose = require("mongoose");

router.get("/getrequest",async (req,res)=>{
         

         const data=await model.find();
         const finaldata=data.filter(a=>!a.Status);
         
         console.log(finaldata);
   
         return res.status(200).send(finaldata);


})

module.exports=router
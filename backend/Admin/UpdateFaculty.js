const express=require("express")
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const RegisterUser = require("../model/Model");
const bcrypt = require("bcrypt");
const cors = require("cors");
const route=express.Router();
const jwt = require("jsonwebtoken");

const middleware=(req,res,next)=>{

    const token = req.header("x-auth-token");
    try {
        const decoded = jwt.verify(token, 
          process.env.secrete
        ); // Verify token using the same secret key
        req.user = decoded.user; // Attach user info to the request object
        // Check if the user is an admin
        console.log(req.user)
        if (req.user.email !==req.params.email && req.user.position!="Admin") {
          return res.status(403).send("Access denied you can't change the faile that access must be given by admin..");
        }
    
        next(); // Proceed to the next middleware/route handler
      } catch (err) {
        return res.status(401).send("Invalid token");
      }
  

}


route.put("/update/:email", middleware,async (req, res) => {
  try {
    const { name,password,mail,confirmpassword,position } = req.body;
    console.log(name,password,mail,);
    const email=req.params.email;
    if (!mail) {
      return res.status(400).send("email is require for update");

    }

    let user = await RegisterUser.findOne({email:req.params.email });
    if(!user)
      return res.status(404).send("user not found")

    if (password || confirmpassword) {
      if(password!==confirmpassword){
        return res.status(400).send("Password do not match")
      }
        const saltRounds = 10;
        user.password = await bcrypt.hash(password, saltRounds);
    }
    console.log(user.password)

    // Hash password before saving
    
   if(name) user.name=name;
   if(position){
    if(!user.position=="Admin")return res.status(403).send("access denied only admin can change position and email")
    user.position=position;
    if(email)user.email=mail;
   }
   

   //this must be acess for only admin
   

    await user.save();
    res.status(200).send("updated sucessfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});

module.exports=route
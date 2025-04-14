const express = require("express");
const router = express.Router();
const RegisterUser = require("../model/Model");
const jwt =require("jsonwebtoken");
router.get("/profile",async (req,res)=>{

  const token=req.header("x-auth-token");
  if(!token)return res.status(400).send("token must be send");
  
  try{
    const decoded=jwt.verify(token,
      process.env.secrete
    )
    decoded.user.department="Computer Science Department";
    
    return res.status(200).send(decoded.user);


  }
  catch(err){
    return res.send(404).send("some error occured while getting or your session expires plz login again")
}
}
);

module.exports = router;
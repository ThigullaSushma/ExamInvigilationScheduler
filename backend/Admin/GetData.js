const express = require("express");
const router = express.Router();
const RegisterUser = require("../model/Model");

// Get all the users from the database
router.get("/facultydata", async (req, res) => {
  try {
    const users = await RegisterUser.find(); // Fetch all users from the database
    res.status(200).json(users); // Return the users in the response
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
});

module.exports = router;
 
/*   
  const token=req.header("x-auth-token");
  if(!token)return res.status(400).send("token must be send");

  try{
    const decoded=jwt.verify(token,
      process.env.secrete
    )
    
    return res.status(200).send(decoded.user);


  }
  catch(err){
    return res.send(404).send("some error occured while getting or your session expires plz login again")
  }*/

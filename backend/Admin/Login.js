const express = require("express");
const RegisterUser = require("../model/Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const route = express.Router();

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    let exist = await RegisterUser.findOne({ email:email.toLowerCase() });
    if (!exist) {
      return res.status(400).send("User not found");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, exist.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    // Create payload with user details
    let payload = {
      user: {
        id: exist._id,
        name: exist.name,
        email: exist.email,
        position: exist.position,
        EmployeeId:exist.EmployeeId,
      },
    };

    // Generate JWT token
    jwt.sign(
      payload,
      "anithkumarchowdary", // Replace this with a stronger secret key
      { expiresIn: 3600000 }, // 1 hour expiration time
      (err, token) => {
        if (err) throw err;
        return res.json({ token,admin:exist.position==="Admin" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

module.exports = route;

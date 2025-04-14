const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
const RegisterUser = require("../model/Model");
const bcrypt = require("bcrypt");
const cors = require("cors");
const router = express.Router();
const adminMiddleware = require("../Admin/JwtMiddleware");

router.post("/register", adminMiddleware, async (req, res) => {
  try {
    const { name, email, password, confirmpassword, position } = req.body;

    if (!name || !email || !password || !confirmpassword) {
      return res.status(400).send("All fields are required");
    }

    let exist = await RegisterUser.findOne({ email: email });
    if (exist) {
      return res.status(400).send("User already exists");
    }

    // Find the last EmployeeId and increment it
    let lastUser = await RegisterUser.findOne().sort({ EmployeeId: -1 }); // Sort in descending order
    let lastEmployeeId = lastUser
      ? parseInt(lastUser.EmployeeId.replace("EMP", ""), 10)
      : 0;
    let newEmployeeId = `EMP${(lastEmployeeId + 1)
      .toString()
      .padStart(4, "0")}`;

    if (password !== confirmpassword) {
      return res.status(400).send("Passwords do not match");
    }

    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = new RegisterUser({
      name,
      email,
      password: hashedPassword,
      position,
      EmployeeId: newEmployeeId,
    });

    await newUser.save();
    res.status(200).send("Registered successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;

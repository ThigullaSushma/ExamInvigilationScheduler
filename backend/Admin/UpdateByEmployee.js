const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RegisterUser = require("../model/Model");
const route = express.Router();

const middleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.secrete);
    req.user = decoded.user;

    if (req.user.EmployeeId !== req.params.EmployeeId) {
      return res
        .status(403)
        .send("Access denied. Only authorized users can perform this action.");
    }

    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

route.put("/updatebyemployee/:EmployeeId", middleware, async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const EmployeeId = req.params.EmployeeId;

    let user = await RegisterUser.findOne({ EmployeeId });
    if (!user) return res.status(404).send("User not found");

    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    if (name) user.name = name;
    if (email) {
      const existingUser = await RegisterUser.findOne({ email });
      if (existingUser && existingUser.EmployeeId !== EmployeeId) {
        return res
          .status(400)
          .send("Email already in use by another employee.");
      }
      user.email = email;
    }

    await user.save();

    const payload = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        position: user.position,
        EmployeeId: user.EmployeeId,
      },
    };

    const token = jwt.sign(payload, process.env.secrete, { expiresIn: "1h" });

    return res.json({ token, admin: user.position === "Admin", user });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send("An error occurred while updating the profile.");
  }
});

module.exports = route;

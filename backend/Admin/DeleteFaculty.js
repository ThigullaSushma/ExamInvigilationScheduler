// to delete the faculty need to send token as x-auth-token and body as role:"admin" for login

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const RegisterUser = require("../model/Model");
const bcrypt = require("bcrypt");
const cors = require("cors");
const route = express.Router();
const authmiddleware = require("../Admin/JwtMiddleware");


route.delete("/delete/:email",authmiddleware, async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) return res.status(400).send("enter email in the route");
    console.log(email)
    let exist = await RegisterUser.findOneAndDelete({ email });
    if (!exist) {
      return res.status(400).send("User not exists");
    }

    res.status(200).send("deleted sucessfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }

});

module.exports = route;

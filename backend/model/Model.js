const mongoose=require("mongoose")

let RegisterUser = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    // required:true
  },
  EmployeeId: {
    type: String,
    required:true,
    unique:true,
    // required:true
  },
});

module.exports=mongoose.model('FacultyDetails',RegisterUser);
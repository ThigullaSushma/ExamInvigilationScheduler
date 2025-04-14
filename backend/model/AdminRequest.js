const mongoose=require("mongoose")
const Schedule = require("./Schedule")

const AdminRequest = mongoose.Schema({
  No: {
    type: Number,
    required: true,
  },
  RequestDate: {
    type: String,
    required: true,
  },
  Data: {
    type: String,
    required: true,
  },
  EmployeeId: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
  },
  ScheduleNo: {
    type: Number,
    required: true,
  },
  Indexes: {
    type: [Number],
    required: true,
  },
  FacultyRequestIndex: {
    type: Number
  },
});

module.exports=mongoose.model('AdminRequests',AdminRequest)
const mongoose=require("mongoose")

const FacultyRequest = mongoose.Schema({
  EmployeeId: {
    type: String,
    required: true,
  },
  Requests: {
    type: [{}],//day,room,
    default: [],
  },
});

module.exports = mongoose.model("FacultyRequests", FacultyRequest);
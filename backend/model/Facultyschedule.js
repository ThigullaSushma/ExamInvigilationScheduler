const mongoose=require("mongoose")

let FacultySchedule=new mongoose.Schema({

  EmployeeId:{
    type:String,
    required:true
  },
  InvigilationDuties:{
    type:[{}],
    required:true
  },
  HandlingYears:{
    type:[Number],
    default:[],
    required:true
  },

})

module.exports=mongoose.model("FacultySchedule",FacultySchedule);
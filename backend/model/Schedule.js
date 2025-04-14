const mongoose=require("mongoose");

//room format string with roomnumber as code in v121 kind of 
//dates in format of 01-jan-2024 10:00-12:00 FN ,1:30-3:30 AN (consotimization option)

const Schedule=mongoose.Schema({
    
    ScheduleExamName:{
           type:String,
           required:true
    },
    ScheduleNo:{
      type:Number,
      required:true
    },
    StartDate:{
      type:String,
      required:true
    },
    EndDate:{
      type:String,
      required:true
    },
    ScheduleTimings:{
          type:[String],
          required:true
    },
    RoomDetails:{
      type:[String],
      required:true
    },
    Assignment:{
      type:[[String]],
      required:true,
    }



})

module.exports=mongoose.model('Schedule',Schedule)
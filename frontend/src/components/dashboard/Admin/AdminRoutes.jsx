import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import AddFaculty from "../menuefunctions/AddFaculty";
import DeleteFaculty from "../menuefunctions/DeleteFaculty";
import UpdateFaculty from "../menuefunctions/UpdateFaculty";
import GetFaculty from "../menuefunctions/GetFaculty";
import PrevSchedules from "../menuefunctions/PrevSchedules";
import CreateSchedule from "../../Schedules/CreateSchedule";
import AdminRequests from "../menuefunctions/AdminRequests";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/add-faculty" element={<AddFaculty/>} />
      <Route path="/delete-faculty" element={<DeleteFaculty/>} />
      <Route path="/update-faculty" element={<UpdateFaculty/>} />
      <Route path="/get-faculty" element={<GetFaculty/>} />
      <Route path="/prev-schedules" element={<PrevSchedules/>} />
      <Route path="/create-schedule" element={<CreateSchedule/>}/>
      <Route path="/faculty-request" element={<AdminRequests/>}/>
    </Routes>
  );
};

export default AdminRoutes;

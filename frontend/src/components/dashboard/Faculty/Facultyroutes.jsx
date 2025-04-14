import { Route, Routes } from "react-router-dom";
import React from 'react'
import UpdatePage from "./UpdatePage";
import GetFacultyCurrentSchedule from "./GetFacultyCurrentSchedule";
import RiseRequest from "../../Requests/RiseRequest";
import RequestStatus from "../../Requests/RequestStatus";
import Finemodule from "./Finemodule";
// import Fre
const Facultyroutes = () => {
  return (
    <Routes>
      <Route path="/updatefaculty" element={<UpdatePage />}></Route>
      <Route
        path="/currentschedulebyid"
        element={<GetFacultyCurrentSchedule />}
      ></Route>
      <Route path="/sendrequest" element={<RiseRequest />} />
      <Route path="/requeststatus" element={<RequestStatus />} />
      <Route path="/fine" element={<Finemodule/>} />
    </Routes>
  );
}

export default Facultyroutes
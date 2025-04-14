import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./index.css";
import Login from "./components/Login";
import AdminDashBord from "./components/dashboard/AdminDashBord";
import FacultyDashBoard from "./components/dashboard/FacultyDashBoard";
import AdminRoutes from "./components/dashboard/Admin/AdminRoutes";
import Facultyroutes from "./components/dashboard/Faculty/Facultyroutes";
import CreateSchedule from "./components/Schedules/CreateSchedule";
import GetCurrentSchedule from "./components/Schedules/GetCurrentSchedule";
import RisedRequests from "./components/Requests/RaisedRequests";
import AdminRequests from "./components/dashboard/menuefunctions/AdminRequests";
import Finemodule from "./components/dashboard/Faculty/Finemodule";


function App() {


  return (

    // <Finemodule/>
      
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/facultydashboard" element={<FacultyDashBoard />}></Route>
        <Route path="/admindashboard" element={<AdminDashBord />}></Route>
        <Route path="/facultydashboard/*" element={<Facultyroutes />} />
        <Route path="/admindashboard/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;


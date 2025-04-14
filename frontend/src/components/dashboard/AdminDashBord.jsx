import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Adminavigation from "./Admin/Adminavigation";
import AdminMenue from "./Admin/AdminMenue";
import CurrentSchedule from "./Admin/CurrentSchedule";
import Adminstyle from "./Admin/Adminstyle";

import { TokenContext } from "./TokenContext";
import AdminRoutes from "./Admin/AdminRoutes";
import GetCurrentSchedule from "../Schedules/GetCurrentSchedule";



const AdminDashBord = () => {
  const response = useLocation();

  const { token, admin } = response.state || { admin: false };
  const [data, setData] = useState({});
  
  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token]);

  const fetchData = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/facultydata", {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      setData(res.data); // Correctly setting fetched data
      console.log(res); // Log fetched data
    } catch (err) {
      console.error("Error in fetching data:", err);
    }
  };

  return (
    <>
      <TokenContext.Provider value={token }>
        <div>
          <Adminavigation />
          <div className=" flex">
            <AdminMenue />
            <GetCurrentSchedule/>
          </div>
        </div>
      </TokenContext.Provider>
    </>
  );
};

export default AdminDashBord;

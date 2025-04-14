import React, { useEffect, useState } from "react";
import axios from "axios";
import ScheduleDisplay from "../../Schedules/ScheduleDisplay";
import { useLocation } from "react-router-dom";

const GetFacultyCurrentSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const location = useLocation();
  const { token, facultyData } = location.state || {}; // Ensure safe extraction

  useEffect(() => {
    if (!facultyData?.EmployeeId) return; // Prevent API call if EmployeeId is missing

    const fetchSchedule = async () => {
      try {
        console.log(facultyData.EmployeeId)
        const response = await axios.get(
          `http://localhost:5000/getcurrentschedulebyId/${facultyData.EmployeeId}`
        );
        console.log(response.data);
        setScheduleData(response.data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, [facultyData?.EmployeeId]); // Re-run only when EmployeeId changes

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        📅 Current Schedule
      </h1>
      {scheduleData.length > 0 ? (
        <ScheduleDisplay scheduleData={scheduleData} />
      ) : (
        <p className="text-center text-gray-600">
          No current invigilations found.
        </p>
      )}
    </div>
  );
};

export default GetFacultyCurrentSchedule;

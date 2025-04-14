import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = location.state;

  const [facultyData, setFacultyData] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [fineAmount, setFineAmount] = useState(null); // State to store fine amount

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profile", {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        });
        setFacultyData(response.data);
      } catch (err) {
        console.error("Error fetching faculty details", err);
      }
    };

    fetchFacultyData();
  }, [token]);

  useEffect(() => {
    if (facultyData.EmployeeId) {
      const fetchSchedule = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/getcurrentschedulebyId/${facultyData.EmployeeId}`
          );
          setSchedule(response.data);
        } catch (error) {
          console.error("Error fetching schedule:", error);
        }
      };

      fetchSchedule();
    }
  }, [facultyData.EmployeeId]);

  useEffect(() => {
    if (facultyData.EmployeeId) {
      const fetchFineAmount = async () => {
        try {
          const response = await axios.post(`http://localhost:5000/fine`,
            {EmployeeId:facultyData.EmployeeId}
          );
          setFineAmount(response.data.length); // Assuming API response has fineAmount key
        } catch (error) {
          console.error("Error fetching fine amount:", error);
        }
      };

      fetchFineAmount();
    }
  }, [facultyData.EmployeeId]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Faculty Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Welcome back, {facultyData.name || "Faculty"}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/20">
          <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
            <span className="mr-2">👤</span> Profile Details
          </h2>
          <p className="text-lg">
            <span className="font-semibold">Name:</span> {facultyData.name}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {facultyData.email}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Department:</span>{" "}
            {facultyData.department}
          </p>
          <Link to="updatefaculty" state={{ token, facultyData }}>
            <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all">
              Update
            </button>
          </Link>
        </div>

        {/* Current Schedule Card */}
        <div className="bg-blue-100/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-blue-200/20">
          <h2 className="text-2xl font-bold mb-4 text-blue-600 flex items-center">
            <span className="mr-2">📅</span> Current Schedule
          </h2>
          <p className="text-lg">
            <span className="font-semibold">Next Invigilation Duty:</span>{" "}
            {schedule.length > 0 ? (
              <Link to="currentschedulebyid" state={{ token, facultyData }}>
                Current Schedule ***
              </Link>
            ) : (
              <span>No current invigilations found.</span>
            )}
          </p>
        </div>

        {/* Fine Module Card - Only show if there is a fine */}
        {/* Fine Module Card - Show only if fineAmount > 4 */}
        {fineAmount !== null &&
          (fineAmount > 0 ? (
            <div className="bg-yellow-100/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-yellow-200/20">
              <h2 className="text-2xl font-bold mb-4 text-yellow-600 flex items-center">
                <span className="mr-2">💰</span> Fine Module
              </h2>
              <button className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all">
                <Link to="fine" state={{ token, facultyData }}>
                  Check and Pay
                </Link>
              </button>
            </div>
          ) : (
            <div className="bg-green-100/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-green-200/20">
              <h2 className="text-2xl font-bold mb-4 text-green-600 flex items-center">
                <span className="mr-2">✅</span> No Fine
              </h2>
              <p className="text-lg">You have no pending fines.</p>
            </div>
          ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Raise Request Card */}
        <div className="bg-purple-100/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-purple-200/20">
          <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
            <span className="mr-2">📤</span> Raise Request
          </h2>
          <Link to="sendrequest" state={{ token, facultyData }}>
            <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all">
              Submit Request
            </button>
          </Link>
        </div>

        {/* Check Request Status Card */}
        <div className="bg-purple-100/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-purple-200/20">
          <h2 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
            <span className="mr-2">📤</span> Check Raised Request (Status)
          </h2>
          <Link to="requeststatus" state={{ token, facultyData }}>
            <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all">
              Check Status
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

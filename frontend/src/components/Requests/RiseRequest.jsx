import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const RiseRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, facultyData } = location.state || {};
  const [duties, setDuties] = useState([]);
  const [reasons, setReasons] = useState({}); // State to store reasons

  useEffect(() => {
    if (facultyData?.EmployeeId) {
      const fetchDuties = async () => {
        try {
          const response = await axios.post(
            `http://localhost:5000/getduties/${facultyData.EmployeeId}`
          );
          setDuties(response.data);
        } catch (error) {
          console.error("Error fetching duties:", error);
        }
      };

      fetchDuties();
    }
  }, [facultyData.EmployeeId]);

  const handleRaiseRequest = async (duty) => {
    if (!reasons[duty.Id]) {
      alert("Please enter a reason for raising the request.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/sendrequest", {
        Id: duty.Id,
        EmployeeId: facultyData.EmployeeId,
      });
        await axios.post("http://localhost:5000/AdminRequest", {
        data: reasons[duty.Id], // Include the reason in request
        EmployeeId: facultyData.EmployeeId,
        Status: "Pending",
        ScheduleNo: duty.ScheduleNo,
        Indexes: [duty.Row, duty.Col],
      });

      alert(`Request raised for duty on ${duty.date} in room ${duty.room}`);
      navigate("/facultydashboard", { state: { token } });
    } catch (error) {
      console.error("Error raising request:", error);
      alert(error.response?.data?.message || "Failed to raise request.");
    }
  };

  const handleReasonChange = (dutyId, value) => {
    setReasons((prev) => ({
      ...prev,
      [dutyId]: value,
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Assigned Duties</h2>

      {duties.length > 0 ? (
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Room</th>
              <th className="p-3">Session</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {duties.map((duty, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{duty.date}</td>
                <td className="p-3">{duty.room}</td>
                <td className="p-3">{duty.session}</td>
                <td className="p-3">
                  <textarea
                    className="border p-2 w-full"
                    placeholder="Enter reason"
                    value={reasons[duty.Id] || ""}
                    onChange={(e) =>
                      handleReasonChange(duty.Id, e.target.value)
                    }
                  />
                </td>
                <td className="p-3">
                  {!duty.Request ? (
                    <button
                      onClick={() => handleRaiseRequest(duty)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Raise Request
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-green-500 text-white rounded">
                      Your Raised
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No duties assigned or you already raised request.</p>
      )}
    </div>
  );
};

export default RiseRequest;

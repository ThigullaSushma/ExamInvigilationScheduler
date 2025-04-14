import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/GetAdminRequests"
      );
      setRequests(response.data);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleStatusChange = async (request, flag) => {
    try {
      const payload = {
        No: request.No,
        RequestDate: request.RequestDate,
        Data: request.Data,
        EmployeeId: request.EmployeeId,
        Status: request.Status,
        ScheduleNo: request.ScheduleNo,
        Index: request.Indexes,
        FacultyRequestIndex: request.FacultyRequestIndex,
        check: flag,
      };

      console.log("Payload Sent:", payload);
      await axios.post("http://localhost:5000/grantrequest", payload);
      fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Admin Panel - Manage Requests
      </h2>

      {requests && requests.length > 0 ? (
        <div className="overflow-x-auto w-full max-w-5xl">
          <table className="w-full bg-white shadow-lg rounded-lg border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-4 border-b">Date</th>
                <th className="p-4 border-b">Employee ID</th>
                <th className="p-4 border-b">Request</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{request.RequestDate}</td>
                  <td className="p-4">{request.EmployeeId}</td>
                  <td className="p-4">{request.Data}</td>
                  <td className="p-4">
                    {request.Status === "true" ? (
                      <span className="px-3 py-1 text-sm font-semibold bg-green-500 text-white rounded-full">
                        ✅ Approved
                      </span>
                    ) : request.Status === "false" ? (
                      <span className="px-3 py-1 text-sm font-semibold bg-red-500 text-white rounded-full">
                        ❌ Denied
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm font-semibold bg-yellow-500 text-white rounded-full">
                        ⏳ Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        onClick={() => handleStatusChange(request, true)}
                      >
                        Grant ✅
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        onClick={() => handleStatusChange(request, false)}
                      >
                        Deny ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white p-6 shadow-lg rounded-lg mt-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
            alt="No requests"
            className="w-20 h-20 opacity-60 mb-4"
          />
          <p className="text-lg text-gray-700 font-semibold">
            No pending requests at the moment.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            New requests will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;

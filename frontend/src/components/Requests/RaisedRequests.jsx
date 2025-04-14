import React, { useState, useEffect } from "react";
import axios from "axios";

const RaisedRequests = () => {
  const [requests, setRequests] = useState([]);
  const EmployeeId = "EMP0001";

  useEffect(() => {
    const fetchRaisedRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/raisedrequests",
          {
            params: { EmployeeId }, // ✅ Correct way to pass query params
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching raised requests:", error);
      }
    };

    fetchRaisedRequests();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        My Raised Requests
      </h2>

      {requests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-700">
                <th className="p-4">Date</th>
                <th className="p-4">Room</th>
                <th className="p-4">Session</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{request.date}</td>
                  <td className="p-4">{request.room}</td>
                  <td className="p-4">{request.session}</td>
                  <td className="p-4">{request.reason}</td>
                  <td className="p-4">
                    {request.status==="true" ? (
                      <span className="px-3 py-1 text-sm font-semibold bg-green-500 text-white rounded-full">
                        ✅ Approved
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm font-semibold bg-yellow-500 text-white rounded-full">
                        ⏳ Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No requests raised yet.</p>
      )}
    </div>
  );
};

export default RaisedRequests;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const RequestStatus = () => {
  const location = useLocation();
  const { facultyData } = location.state || {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/getfacultyrequest", {
        params: { EmployeeId: facultyData?.EmployeeId },
      })
      .then((response) => {
        setRequests(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Raised Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg border">
          <thead className="bg-gray-100">
            <tr className="border-b">
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Session</th>
              <th className="p-4 text-left">Data</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr
                  key={request._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{request.date}</td>
                  <td className="p-4">{request.session}</td>
                  <td className="p-4">{request.reason}</td>
                  <td className="p-4">
                    {request.status === "true" ? (
                      <span className="px-3 py-1 text-sm font-semibold bg-green-500 text-white rounded-full">
                        ✅ Approved
                      </span>
                    ) : request.status === "false" ? (
                      <span className="px-3 py-1 text-sm font-semibold bg-red-500 text-white rounded-full">
                        ❌ Denied
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-sm font-semibold bg-yellow-500 text-white rounded-full">
                        ⏳ Pending
                      </span>
                    )}
                  </td>
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestStatus;

import React, { useEffect, useState } from "react";

const Finemodule = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/fine", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setRequests(data); // Store filtered requests in state
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
        Faculty Leave Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-600 text-lg">No matching requests found.</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-4xl shadow-lg rounded-lg">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white text-lg">
              <tr>
                <th className="border p-3">Reason</th>
                <th className="border p-3">Date</th>
                <th className="border p-3">Room</th>
                <th className="border p-3">Session</th>
                <th className="border p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr
                  key={index}
                  className={`text-center text-gray-800 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-all duration-300`}
                >
                  <td className="border p-3">{req.reason}</td>
                  <td className="border p-3">{req.date}</td>
                  <td className="border p-3">{req.room}</td>
                  <td className="border p-3">{req.session}</td>
                  <td
                    className={`border p-3 font-semibold ${
                      req.status === "true" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {req.status === "true" ? "Approved" : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Fine Section */}
      {requests.length >0 && (
        <div className="mt-6 px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg shadow-md">
          ⚠ Fine Imposed: ₹5000
        </div>
      )}
    </div>
  );
};

export default Finemodule;

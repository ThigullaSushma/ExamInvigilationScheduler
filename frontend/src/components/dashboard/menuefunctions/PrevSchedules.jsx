import { useState, useEffect } from "react";
import ScheduleDisplay from "../../Schedules/ScheduleDisplay";
import axios from "axios";

export default function PrevSchedules() {
  const [data, setData] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get("http://localhost:5000/allschedule");
        setData(res.data);
        console.log("Successfully got the data", res.data);
      } catch (err) {
        console.error("Error occurred", err);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">📅 Schedules</h2>
        {data.length > 0 ? (
          data.map((schedule) => (
            <button
              key={schedule._id}
              className={`block w-full text-left p-3 my-2 rounded-lg text-gray-800 font-medium transition-all ${
                selectedSchedule?._id === schedule._id
                  ? "bg-blue-500 text-white shadow-md scale-105"
                  : "bg-gray-100 hover:bg-blue-300 hover:text-white"
              }`}
              onClick={() => setSelectedSchedule(schedule)}
            >
              <span className="font-semibold">NO:</span> {schedule.ScheduleNo} |
              <span className="font-semibold"> Date:</span> {schedule.StartDate}
            </button>
          ))
        ) : (
          <p className="text-gray-500 text-center">Loading schedules...</p>
        )}
      </div>

      {/* Schedule Display Section */}
      <div
        className="w-3/4 p-6 flex  items-center justify-center bg-blue-200"
        // style={{ backgroundColor: "#B0C4DE" }}
      >
        {selectedSchedule ? (
          <div
            className="w-full
          rounded-xl p-6 "
          >
            <ScheduleDisplay scheduleData={[selectedSchedule]} />
          </div>
        ) : (
          <p className="text-gray-500 text-lg font-medium">
            🖱️ Click a schedule to view details
          </p>
        )}
      </div>
    </div>
  );
}

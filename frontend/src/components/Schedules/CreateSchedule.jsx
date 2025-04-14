import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function CreateSchedule() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token || null;

  const [numRooms, setNumRooms] = useState(0);
  const [numDays, setNumDays] = useState(0);
  const [Room, setRooms] = useState([]);
  const [Days, setDays] = useState([]);
  const [name, setName] = useState("");

  // Automatically update room list when numRooms changes
  useEffect(() => {
    setRooms(Array.from({ length: numRooms }, () => ""));
  }, [numRooms]);

  // Automatically update days list when numDays changes
  useEffect(() => {
    setDays(Array.from({ length: numDays }, () => ({ date: "", session: "" })));
  }, [numDays]);

  // Handle room name input change
  const handleRoomChange = (index, value) => {
    const updatedRooms = [...Room];
    updatedRooms[index] = value;
    setRooms(updatedRooms);
  };

  // Handle day input (date & session) change
  const handleDayChange = (index, field, value) => {
    const updatedDays = [...Days];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    setDays(updatedDays);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Rooms:", Room);
    console.log("Days:", Days);
    console.log("Name:", name);
    console.log("Token sending:", token);

    try {
      await axios.post("http://localhost:5000/createschedule", {
        Room,
        Days,
        ScheduleExamName: name,
      });
      navigate("/admindashboard", { state: { token } });
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🎓 Create Exam Schedule
        </h2>

        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Schedule Name</label>
          <input
            type="text"
            placeholder="Enter schedule name (e.g., Exam Timings)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rooms Section */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <label className="font-semibold text-gray-700">No. of Rooms</label>
            <input
              type="number"
              placeholder="Enter No. of Rooms"
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={numRooms}
              onChange={(e) => setNumRooms(Number(e.target.value))}
            />
            {Room.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700">
                  Enter Room Names
                </h3>
                {Room.map((room, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Room ${index + 1}`}
                    className="border p-3 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={room}
                    onChange={(e) => handleRoomChange(index, e.target.value)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Days Section */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <label className="font-semibold text-gray-700">No. of Days</label>
            <input
              type="number"
              placeholder="Enter No. of Days"
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={numDays}
              onChange={(e) => setNumDays(Number(e.target.value))}
            />
            {Days.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700">
                  Select Dates & Sessions
                </h3>
                {Days.map((day, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="date"
                      className="border p-3 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={day.date}
                      onChange={(e) =>
                        handleDayChange(index, "date", e.target.value)
                      }
                    />
                    <select
                      className="border p-3 rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={day.session}
                      onChange={(e) =>
                        handleDayChange(index, "session", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="FN">FN</option>
                      <option value="AN">AN</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generate Schedule Button */}
        {Room.length > 0 && Days.length > 0 && (
          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            ✅ Generate Schedule
          </button>
        )}
      </div>
    </div>
  );
}

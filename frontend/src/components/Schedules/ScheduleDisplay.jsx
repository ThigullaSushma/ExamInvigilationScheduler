import React from "react";

const ScheduleDisplay = ({ scheduleData }) => {
  console.log(scheduleData)
  if (!scheduleData || scheduleData.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No current schedules available
      </p>
    );
  }

  return (
    <div className=" mx-auto p-4">
      {scheduleData.map((schedule) => (
        <div
          key={schedule._id}
          className="bg-green-50 shadow-lg rounded-xl p-6 mb-6 border border-gray-200"
        >
          {/* Schedule Header */}
          <h2 className="text-xl font-bold text-gray-700 text-center">
            {schedule.ScheduleExamName} (Schedule No: {schedule.ScheduleNo})
          </h2>
          <p className="text-sm text-gray-500 text-center">
            📅 {schedule.StartDate} - {schedule.EndDate}
          </p>

          {/* Schedule Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">📅 Date & Session</th>
                  {schedule.RoomDetails.map((room, index) => (
                    <th key={index} className="py-2 px-4 border-2">
                      🏫 {room}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.ScheduleTimings.map((timing, rowIndex) => (
                  <tr key={rowIndex} className="border-t text-center">
                    <td className="py-2 px-4 border-2">{timing}</td>
                    {schedule.RoomDetails.map((_, colIndex) => (
                      <td key={colIndex} className="py-2 px-4 border-2">
                        {schedule.Assignment[rowIndex][colIndex] || "N/A"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleDisplay;

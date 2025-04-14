import React, { useEffect, useState } from "react";
import ScheduleDisplay from "./ScheduleDisplay";

const GetCurrentSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/getcurrentschedule")
      .then((res) => res.json())
      .then((data) => setScheduleData(data))
      .catch((err) => console.error("Error fetching schedule:", err));
  }, []);

  console.log(scheduleData);

  return (
    <div className="w-full bg-yellow-200 p-6">
      {/* Moving Text */}
      <div className="overflow-hidden whitespace-nowrap">
        <p className="text-xl font-bold text-right animate-marquee">
          📅 Ongoing or Upcoming Schedules...
        </p>
      </div>

      <ScheduleDisplay scheduleData={scheduleData} />
    </div>
  );
};

export default GetCurrentSchedule;

import axios from "axios";
import React, { useState, useEffect } from "react";
import FacultyTable from "./FacultyTable";
import { useLocation, useNavigate } from "react-router-dom";
// import bcrypt from "bcryptjs";

const GetFaculty = () => {
  const navigate=useNavigate()
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const location=useLocation();
  const {token}=location.state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/facultydata"); // Replace with your API endpoint
        setData(response.data);
      } catch (err) {
        setError("Error in getting data");
        console.error("Error in getting data:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (data) => {
    // setFacultyData(data.filter((faculty) => faculty._id !== id));
     alert(`Deleting faculty with ID: ${data._id}`);
     navigate("/admindashboard/delete-faculty", { state: { ...data, token } });
  };

  const handleUpdate = async (data) => {
    // <UpdateFaculty data={data} />;
    alert(`Update faculty with ID: ${data._id}`);
      // const saltRounds = 10;
      // const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      
      // data.password=hashedPassword,
      // data.confirmpassword=hashedPassword,

    navigate("/admindashboard/update-faculty", {state: {...data,token}} );
    // Implement update logic here (e.g., show a form)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <FacultyTable
        facultyData={data}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default GetFaculty;

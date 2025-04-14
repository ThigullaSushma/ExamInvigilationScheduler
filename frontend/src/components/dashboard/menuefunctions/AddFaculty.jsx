import React, { useState } from "react";
import axios from "axios";
// import { useToken } from "../TokenContext";
import { useLocation,useNavigate } from "react-router-dom";

const AddFaculty = () => {
  //  const token = useToken();
  const navigate = useNavigate();
  const location=useLocation();
   const {token}=location.state||{};
   console.log(token)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    confirmpassword:""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
     console.log(token);
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      alert("Faculty added successfully!");
      console.log("Response:", response.data);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        position: "",
      });
          navigate("/admindashboard", { state: { token } });
    } catch (error) {
      console.error(
        "Error adding faculty:",
        error.response?.data || error.message
      );
      alert(
        "Failed to add faculty. Please check your input or try again later."
      );
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">
          Add New Faculty
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter faculty's full name"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter faculty's email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter a secure password"
              required
            />
          </div>

          {/*  confirm password*/}
          <div>
            <label
              htmlFor="confirmpassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmpassword"
              value={formData.confirmpassword}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter a secure confirmpassword"
              required
            />
          </div>

          {/* Position Dropdown */}
          <div>
            <label
              htmlFor="position"
              className="block text-gray-700 font-medium mb-2"
            >
              Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            >
              <option value="" disabled>
                Select Position
              </option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Lecturer">Lecturer</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Faculty
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFaculty;

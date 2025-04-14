import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const LoginDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      console.log("Form submitted:", response.data);
      setFormData({ email: "", password: "" });
      if (response.data.admin) {
        navigate("/admindashboard", { state: response.data });
      } else {
        navigate("/facultydashboard", { state: response.data });
      }
    } catch (err) {
      console.log("Error occurred in login");
      alert(`Login failed ${err.response.data} `);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-blue-500 to-indigo-600 p-6">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-white mb-8 text-center">
        EXAM INVIGILATION SCHEDULER
      </h1>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 text-center transform transition-all duration-500 hover:scale-105">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Login to access your dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="User Email"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="Password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md transform transition-all duration-200 hover:scale-105 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginDashboard;

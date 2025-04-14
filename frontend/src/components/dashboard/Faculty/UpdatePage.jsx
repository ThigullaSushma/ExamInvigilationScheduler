import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, facultyData } = location.state || {};

  const [updatedProfile, setUpdatedProfile] = useState({
    name: facultyData?.name || "",
    email: facultyData?.email || "",
    password: "",
  });

  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(true);

  const submitUpdatedProfile = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/updatebyemployee/${facultyData?.EmployeeId}`,
        updatedProfile,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      alert("Updated successfully!");

      setUpdatedProfile({
        name: response.data.user.name,
        email: response.data.user.email,
        password: "",
      });

      navigate("/facultydashboard", {
        state: { token: response.data.token },
      });
    } catch (error) {
      console.error(
        "Error updating faculty:",
        error.response?.data || error.message
      );
      alert(
        `Failed to update faculty. ${
          error.response?.data || "An error occurred"
        }`
      );
    }
  };

  return (
    showUpdateProfileModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-600">
            Update Profile
          </h2>

          {/* Name Input */}
          <input
            type="text"
            placeholder="Name"
            value={updatedProfile.name}
            onChange={(e) =>
              setUpdatedProfile({ ...updatedProfile, name: e.target.value })
            }
            className="w-full p-2 border rounded-lg mb-4"
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={updatedProfile.email}
            onChange={(e) =>
              setUpdatedProfile({ ...updatedProfile, email: e.target.value })
            }
            className="w-full p-2 border rounded-lg mb-4"
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={updatedProfile.password}
            onChange={(e) =>
              setUpdatedProfile({ ...updatedProfile, password: e.target.value })
            }
            className="w-full p-2 border rounded-lg mb-4"
          />

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={submitUpdatedProfile}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Save
            </button>

            <button
              onClick={() => setShowUpdateProfileModal(false)}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdatePage;

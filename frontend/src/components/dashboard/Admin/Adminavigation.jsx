import React, { useEffect, useState } from "react";
import logo from "../../../assets/bvritlogo.jpg";
import { useToken } from "../TokenContext";
import { motion } from "framer-motion"; // For smooth animations

const AdminNavigation = () => {
  const token = useToken();
  const [adminDetails, setAdminDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const jwtDecode = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid token format:", error);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAdminDetails(decodedToken?.user);
      } catch (err) {
        console.error("Invalid token format:", err);
      }
    }
    setTimeout(() => setLoading(false), 1000); // Simulated loading effect
  }, [token]);

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 shadow-lg backdrop-blur-md border-b border-gray-700">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <motion.img
          src={logo}
          alt="Logo"
          className="h-16 w-16 rounded-lg shadow-md border-2 border-gray-500 hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.1 }}
        />
        <h1 className="text-white text-2xl font-semibold tracking-wide">
          Exam Invigilation Scheduler
        </h1>
      </div>

      {/* Admin Details Section */}
      <div className="flex items-center space-x-6">
        {loading ? (
          <div className="w-36 h-6 bg-gray-600 animate-pulse rounded-md"></div>
        ) : (
          <>
            <div className="text-right">
              <h2 className="text-lg font-semibold text-white">
                {adminDetails?.name || "Anith Kumar Chowdary"}
              </h2>
              <p className="text-sm text-gray-300">Administrator</p>
            </div>
            {/* Profile Icon */}
            <motion.div
              className="h-12 w-12 bg-gray-800 border-2 border-gray-500 rounded-full flex items-center justify-center shadow-md hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-gray-300 font-semibold text-xl">
                {adminDetails?.name?.charAt(0).toUpperCase() || "A"}
              </span>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminNavigation;

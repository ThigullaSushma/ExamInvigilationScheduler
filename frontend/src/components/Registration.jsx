import React, { useState } from "react";

function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Handle registration logic, possibly make an API request
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Registration Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="w-full mt-2 p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="johndoe@example.com"
            className="w-full mt-2 p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full mt-2 p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Position Field */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Position
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Position</option>
            <option value="Admin">Admin</option>
            <option value="Faculty">Faculty</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Registration;

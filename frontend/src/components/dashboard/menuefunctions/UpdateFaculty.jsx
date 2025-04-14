import React, { useState } from "react";
import axios from "axios";
import { useLocation,useNavigate } from "react-router-dom";
//changes at password...
const UpdateFaculty = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location)
  const { token, __id, name, email, position } =
    location.state || {};
     
  const [formData, setFormData] = useState({
    name: name || "",
    mail: email || "",
    password: "",
    confirmpassword:"",
    position: position || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    console.log("submiting data ",formData);

    if (formData.password !== formData.confirmpassword || formData.password=="") {
      alert("Passwords do not match! or cannot be empty");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/update/${email}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      alert("Updated successfully!");
      console.log("Response:", response.data);
      setFormData({
        name: "",
        mail: "",
        password: "",
        confirmpassword: "",
        position: "",
      });
      navigate("/admindashboard", { state: { token } });
    } catch (error) {
      console.error("Error updating faculty:", error);
      alert(
        "Failed to update faculty. Please check your input or try again later."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">
          Update Faculty
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              name="mail"
              value={formData.mail}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter faculty's email"
              required
            />
          </div>

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
              placeholder="Confirm your password"
              required
            />
          </div>

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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Faculty
          </button>
        </form>
      </div>
    </div>
  );
};



export default UpdateFaculty;

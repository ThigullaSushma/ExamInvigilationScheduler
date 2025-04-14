import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteFaculty = () => {
    const navigate = useNavigate();
  const location = useLocation();
  const { token,email } = location.state || {};
  const [mail, setEmail] = useState(email);
  const [responseMessage, setResponseMessage] = useState([]);

/*
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
    }
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken) {
        const expirationTime = decodedToken.exp * 1000;
        if (Date.now() >= expirationTime) {
          alert("Token has expired. Please log in again.");
        }
      }
    }
  }, [token]);*/



  const handleDelete = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter the employee's email.");
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:5000/delete/${email}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      console.log(res)
      setResponseMessage(res.data,"Employee deleted successfully!");
      setEmail(""); // Clear the input field
      alert("Faculty deleted successfully!");
       
      navigate("/admindashboard", { state: {token} });
      
    } 
    catch (err) {
      console.log("error occured",err)
      const errorMsg =
        err.response.data ||
        "An error occurred while deleting the employee.";
      setResponseMessage(errorMsg);
      // navigate("/admindashboard", { state: { token } });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Delete Employee</h1>
        <form onSubmit={handleDelete}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Employee Email
            </label>
            <input
              type="email"
              id="email"
              value={mail}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl"
          >
            Delete Employee
          </button>
        </form>
        {responseMessage && (
          <div className="mt-4 p-3 bg-gray-200 text-center rounded-xl">
            {responseMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteFaculty;



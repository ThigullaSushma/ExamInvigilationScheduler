import React from "react";


const FacultyTable = ({ facultyData, onDelete, onUpdate }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Faculty List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Position</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {facultyData.map((faculty) => (
              <tr key={faculty._id} className="text-center border-b">
                <td className="py-2 px-4">{faculty.name}</td>
                <td className="py-2 px-4">{faculty.email}</td>
                <td className="py-2 px-4">{faculty.position}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => onUpdate(faculty)}
                    className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onDelete(faculty)}
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyTable;

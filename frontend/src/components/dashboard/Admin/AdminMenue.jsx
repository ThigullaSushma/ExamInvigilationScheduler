import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useToken } from "../TokenContext";
import {
  Home,
  UserPlus,
  Trash2,
  Edit,
  List,
  Calendar,
  Mail,
} from "lucide-react"; // Icons

const menuItems = [
  { name: "Add Faculty", path: "add-faculty", icon: <UserPlus size={20} /> },
  {
    name: "Delete Faculty",
    path: "delete-faculty",
    icon: <Trash2 size={20} />,
  },
  { name: "Update Faculty", path: "update-faculty", icon: <Edit size={20} /> },
  { name: "Get Faculty", path: "get-faculty", icon: <List size={20} /> },
  {
    name: "Prev Schedules",
    path: "prev-schedules",
    icon: <Calendar size={20} />,
  },
  {
    name: "Create Schedule",
    path: "create-schedule",
    icon: <Calendar size={20} />,
  },
  {
    name: "Faculty Request",
    path: "faculty-request",
    icon: <Mail size={20} />,
  },
];

const AdminMenue = () => {
  const token = useToken();
  const location = useLocation(); // Get current page path

  return (
    <div className="w-3/12 bg-gradient-to-b from-gray-500 to-indigo-800 h-screen p-5 shadow-lg">
      <h2 className="text-white text-2xl font-semibold mb-6 tracking-wide">
        Admin Panel
      </h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.path} className="relative">
            <Link
              to={{ pathname: item.path }}
              state={{ token: token }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300
                ${
                  location.pathname.includes(item.path)
                    ? "bg-indigo-600 shadow-md"
                    : "hover:bg-indigo-500"
                }
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMenue;

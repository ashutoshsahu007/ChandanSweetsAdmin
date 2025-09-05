import { Home, Tag, BookOpen, ClipboardList, Clock } from "lucide-react";
import { useState } from "react";
import Dashboard from "./Dashboard";
import Categories from "./Categories";
import Recipes from "./Recipes";
import Orders from "./Orders";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 max-h-screen bg-white shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold px-6 py-4 border-b">Admin Panel</h2>
          <ul className="space-y-1 mt-4">
            {[
              { name: "Dashboard", icon: <Home size={18} /> },
              { name: "Categories", icon: <Tag size={18} /> },
              { name: "Recipes", icon: <BookOpen size={18} /> },
              { name: "Orders", icon: <ClipboardList size={18} /> },
            ].map((item) => (
              <li
                key={item.name}
                className={`flex items-center gap-2 px-6 py-2 cursor-pointer hover:bg-gray-100 ${
                  active === item.name ? "bg-gray-100 font-medium" : ""
                }`}
                onClick={() => setActive(item.name)}
              >
                {item.icon}
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <button className="bg-red-600 text-white font-medium py-2 m-4 rounded hover:bg-red-700">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-h-screen overflow-auto">
        <h1 className="text-2xl font-bold mb-6">{active}</h1>

        {active === "Dashboard" && <Dashboard />}
        {active === "Categories" && <Categories />}
        {active === "Recipes" && <Recipes />}
        {active === "Orders" && <Orders />}
      </div>
    </div>
  );
};

export default AdminDashboard;

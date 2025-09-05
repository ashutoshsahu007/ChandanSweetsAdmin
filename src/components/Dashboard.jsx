import React from "react";
import { Home, Tag, BookOpen, ClipboardList, Clock } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Categories",
      count: 4,
      icon: <Tag className="text-gray-600" size={20} />,
      link: "View all categories",
    },
    {
      title: "Recipes",
      count: 4,
      icon: <BookOpen className="text-gray-600" size={20} />,
      link: "View all recipes",
    },
    {
      title: "Total Orders",
      count: 5,
      icon: <ClipboardList className="text-gray-600" size={20} />,
      link: "View all orders",
    },
    {
      title: "Pending Orders",
      count: 1,
      icon: <Clock className="text-gray-600" size={20} />,
      link: "View pending orders",
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-lg p-4 flex flex-col"
          >
            <div className="flex items-center gap-2">
              {stat.icon}
              <h2 className="font-medium">{stat.title}</h2>
            </div>
            <p className="text-2xl font-bold my-2">{stat.count}</p>
            <a
              href="#"
              className="text-sm text-purple-600 hover:underline mt-auto"
            >
              {stat.link}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { Tag, BookOpen, ClipboardList, Clock } from "lucide-react";

const BASE_URL = "https://restro-a8f84-default-rtdb.firebaseio.com";

export default function Dashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    recipes: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });

  const fetchStats = async () => {
    try {
      // fetch all in parallel
      const [catRes, recRes, ordRes] = await Promise.all([
        fetch(`${BASE_URL}/categories.json`),
        fetch(`${BASE_URL}/recipes.json`),
        fetch(`${BASE_URL}/orders.json`),
      ]);

      const [categories, recipes, orders] = await Promise.all([
        catRes.json(),
        recRes.json(),
        ordRes.json(),
      ]);

      const categoriesCount = categories ? Object.keys(categories).length : 0;
      const recipesCount = recipes ? Object.keys(recipes).length : 0;

      let totalOrders = 0;
      let pendingOrders = 0;

      if (orders) {
        const ordersArr = Object.values(orders);
        totalOrders = ordersArr.length;
        pendingOrders = ordersArr.filter(
          (o) => String(o.status).toLowerCase() === "pending" || !o.status // treat empty as pending
        ).length;
      }

      setStats({
        categories: categoriesCount,
        recipes: recipesCount,
        totalOrders,
        pendingOrders,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Categories",
      count: stats.categories,
      icon: <Tag className="text-gray-600" size={20} />,
      link: "View all categories",
    },
    {
      title: "Recipes",
      count: stats.recipes,
      icon: <BookOpen className="text-gray-600" size={20} />,
      link: "View all recipes",
    },
    {
      title: "Total Orders",
      count: stats.totalOrders,
      icon: <ClipboardList className="text-gray-600" size={20} />,
      link: "View all orders",
    },
    {
      title: "Pending Orders",
      count: stats.pendingOrders,
      icon: <Clock className="text-gray-600" size={20} />,
      link: "View pending orders",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, index) => (
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
}

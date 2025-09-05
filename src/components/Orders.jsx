import { useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: "HL9ZHO9RWa6wOgx1BgPp",
      items: 1,
      total: 249,
      address: "17/302/07, Ayodhya Colony, Ichalkaranji, Maharashtra 416115",
      phone: "09405584375",
      status: "Cancelled",
      date: "20/04/2025",
    },
    {
      id: "LROJmelw6O8ID84c5i8M",
      items: 1,
      total: 299,
      address: "17/302/07, Ayodhya Colony, Ichalkaranji, Maharashtra 416115",
      phone: "09405584375",
      status: "Delivered",
      date: "20/04/2025",
    },
    {
      id: "S5X0EHyKbX3MFmlLZWVq",
      items: 1,
      total: 498,
      address: "17/302/07, Ayodhya Colony, Ichalkaranji, Maharashtra 416115",
      phone: "09405584375",
      status: "Delivered",
      date: "20/04/2025",
    },
    {
      id: "tE8aVuFx9x2P7nQVM8gD",
      items: 1,
      total: 299,
      address: "17/302/07, Ayodhya Colony, Ichalkaranji, Maharashtra 416115",
      phone: "09405584375",
      status: "Pending",
      date: "23/04/2025",
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Preparing: "bg-blue-100 text-blue-700",
    "Out for delivery": "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6">
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 shadow-sm flex justify-between items-start"
          >
            {/* Left Section */}
            <div>
              <a
                href="#"
                className="text-indigo-600 font-medium hover:underline"
              >
                Order #{order.id}
              </a>
              <p className="text-sm text-gray-600">
                {order.items} items &nbsp; Total: ${order.total}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Delivery Address:</span>{" "}
                {order.address}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {order.phone}
              </p>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end space-y-2">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className={`px-3 py-1 rounded text-sm border ${
                  statusColors[order.status]
                }`}
              >
                <option>Pending</option>
                <option>Preparing</option>
                <option>Out for delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
              <p className="text-sm text-gray-500">Ordered on {order.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

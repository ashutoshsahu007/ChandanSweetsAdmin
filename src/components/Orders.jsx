// src/components/AdminOrders.jsx
import React, { useEffect, useState } from "react";

const statusOptions = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-600",
  confirmed: "bg-blue-100 text-blue-600",
  preparing: "bg-purple-100 text-purple-600",
  out_for_delivery: "bg-orange-100 text-orange-600",
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://restro-a8f84-default-rtdb.firebaseio.com/orders";

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}.json`);
      const data = await res.json();

      if (data) {
        const loadedOrders = Object.entries(data).map(([id, order]) => ({
          id,
          ...order,
        }));

        loadedOrders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(loadedOrders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${BASE_URL}/${orderId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      // Update locally too
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // poll for realtime
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-orange-600 mb-6">
          🛠️ Admin Order Management
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border rounded-2xl p-5 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  {/* Order Details */}
                  <div>
                    <p className="text-orange-600 font-semibold">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">User:</span> {order.userId}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Total:</span> ₹
                      {order.totalAmount}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Address:</strong> {order.deliveryDetails?.street},{" "}
                      {order.deliveryDetails?.city},{" "}
                      {order.deliveryDetails?.state} -{" "}
                      {order.deliveryDetails?.zip}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Phone:</strong> {order.deliveryDetails?.phone}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex flex-col items-end">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize border ${
                        statusColors[order.status]
                      } cursor-pointer`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Items List */}
                <div className="mt-4 border-t pt-3">
                  <h3 className="font-semibold text-gray-800 mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";

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
  const [orders, setOrders] = useState(() => {
    // ✅ Initialize from cache only once
    const cached = sessionStorage.getItem("orders");
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(orders.length === 0);
  const [filter, setFilter] = useState("all");

  const BASE_URL = "https://restro-a8f84-default-rtdb.firebaseio.com/orders";

  // ✅ useCallback ensures the same function reference for setInterval
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}.json`);
      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      if (!data) return;

      const loadedOrders = Object.entries(data).map(([id, order]) => ({
        id,
        ...order,
      }));

      // ✅ Sort by creation date (newest first)
      loadedOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // ✅ Compare with cached data before updating state
      const cached = sessionStorage.getItem("orders");
      const cachedData = cached ? JSON.parse(cached) : [];

      const isDifferent =
        cachedData.length !== loadedOrders.length ||
        cachedData.some(
          (c, i) =>
            c.id !== loadedOrders[i].id || c.status !== loadedOrders[i].status
        );

      if (isDifferent) {
        setOrders(loadedOrders);
        sessionStorage.setItem("orders", JSON.stringify(loadedOrders));
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchOrders(); // initial fetch
    const interval = setInterval(fetchOrders, 5000); // ✅ poll for realtime updates
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    const prevOrders = orders;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      const res = await fetch(`${BASE_URL}/${orderId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update on server");
    } catch (err) {
      console.error("Error updating order:", err);
      // rollback if needed
      setOrders(prevOrders);
    }
  };

  const filterOrders =
    filter == "all" ? orders : orders.filter((order) => order.status == filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-orange-600">
          🛠️ Admin Order Management
        </h1>

        <div className="flex gap-6 py-4">
          <button
            onClick={() => setFilter("all")}
            className={` ${
              filter == "all" ? "bg-orange-500 text-white" : "bg-gray-300"
            } px-3 py-1.5 rounded-lg cursor-pointer  font-medium capitalize`}
          >
            All
          </button>
          {statusOptions.map((item) => (
            <button
              onClick={() => setFilter(item)}
              className={`${
                filter == item ? `${statusColors[item]}` : "bg-gray-300"
              }  px-3 py-1.5 cursor-pointer rounded-lg  font-medium capitalize`}
            >
              {item.replaceAll("_", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : filterOrders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {filterOrders.map((order) => (
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
                          {status.replaceAll("_", " ")}
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

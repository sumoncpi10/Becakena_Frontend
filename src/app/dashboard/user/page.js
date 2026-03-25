"use client";

import { useEffect, useState } from "react";
import API from "../../../services/api";

export default function UserDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders 📦</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow bg-white">
              <h2 className="font-semibold mb-2">Order ID: {order._id}</h2>
              <p>Status: <strong>{order.status}</strong></p>
              <p>Total: ৳ {order.totalPrice}</p>
              <div className="mt-2 space-y-1">
                {order.products.map((p) => (
                  <div key={p.product._id} className="flex justify-between">
                    <span>{p.product.name} x {p.quantity}</span>
                    <span>৳ {p.product.price * p.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
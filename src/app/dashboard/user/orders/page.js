"use client";

import { useEffect, useState } from "react";
import API from "../../../../services/api";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders 🛒</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o._id} className="p-4 bg-white rounded shadow">
              <p><strong>Order ID:</strong> {o._id}</p>
              <p><strong>Status:</strong> {o.status}</p>
              <p><strong>Total:</strong> ৳ {o.totalPrice}</p>
              <div className="mt-2">
                {o.products.map(p => (
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
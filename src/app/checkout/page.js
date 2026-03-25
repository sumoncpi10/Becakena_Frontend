"use client";

import { useEffect, useState } from "react";
import API from "../../services/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Load cart safely
  useEffect(() => {
    const loadCart = () => {
      try {
        const data = JSON.parse(localStorage.getItem("cart"));
        setCart(Array.isArray(data) ? data : []);
      } catch {
        setCart([]);
      }
    };

    loadCart();

    // Listen for cart updates from Navbar
    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (index, delta) => {
    const updated = cart.map((item, i) =>
      i === index ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    saveCart(updated);
  };

  const handleRemoveItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty");

    setLoading(true);

    try {
      const products = cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      const res = await API.post("/orders", { products });

      if (res.data.success) {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
        setCart([]);
        setSuccess("Order placed successfully ✅");
      } else {
        alert("Order failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Order failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-5 text-center">
        <h2 className="text-xl font-bold">{success}</h2>
        <button
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Checkout</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between items-center border-b py-2">
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span>৳ {item.price} x {item.quantity} = ৳ {item.price * item.quantity}</span>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleQuantityChange(i, -1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleQuantityChange(i, 1)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(i)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <span className="font-semibold">৳ {item.price * item.quantity}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold py-2 mt-3 text-lg">
            <span>Total:</span>
            <span>৳ {total}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`mt-4 w-full py-2 rounded text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load role from token
  const getRoleFromToken = () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.role;
    } catch {
      return null;
    }
  };

  // Load cart from localStorage safely
  const loadCart = () => {
    try {
      const data = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  // Save cart and trigger update event
  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  useEffect(() => {
    setRole(getRoleFromToken());
    setCart(loadCart());

    // Listen for external cart updates
    const handleStorageChange = () => setCart(loadCart());
    const handleCartEvent = () => setCart(loadCart());

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartEvent);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setRole(null);
    router.push("/login");
  };

  const getDashboardLink = () => {
    switch (role) {
      case "admin":
        return "/dashboard/admin";
      case "vendor":
        return "/dashboard/vendor";
      case "user":
        return "/dashboard/user";
      default:
        return "#";
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: qty } : item
    );
    saveCart(updatedCart);
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    saveCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <nav className="flex flex-col md:flex-row items-center justify-between p-4 bg-orange-500 text-white shadow-md">
        <h1
          className="text-2xl font-bold mb-2 md:mb-0 cursor-pointer"
          onClick={() => router.push("/")}
        >
          BecaKena
        </h1>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full md:w-1/2 px-4 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-orange-300 mb-2 md:mb-0"
        />

        <div className="flex items-center gap-4">
          {role && (
            <a href={getDashboardLink()} className="font-medium hover:underline">
              Dashboard
            </a>
          )}

          {/* Cart Button (users & guests only) */}
          {(role !== "vendor" && role !== "admin") && (
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative flex items-center gap-2 bg-white text-orange-500 px-3 py-1 rounded font-semibold hover:bg-gray-200"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {role ? (
            <button
              onClick={handleLogout}
              className="bg-white text-orange-500 px-3 py-1 rounded font-semibold hover:bg-gray-200"
            >
              Logout
            </button>
          ) : (
            <a href="/login" className="font-medium hover:underline">
              Login
            </a>
          )}
        </div>
      </nav>

      {/* Slide-out Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-bold">🛒 Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-red-500 font-bold">X</button>
        </div>

        <div className="p-4 overflow-y-auto" style={{ maxHeight: "80vh" }}>
          {cart.length === 0 && <p>No items in cart.</p>}

          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>৳ {item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                >
                  -
                </button>

                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) handleQuantityChange(item._id, val);
                  }}
                  className="w-12 text-center border rounded"
                />

                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                >
                  +
                </button>

                <button
                  onClick={() => handleRemove(item._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>

              <p className="font-semibold">৳ {item.price * item.quantity}</p>
            </div>
          ))}

          {cart.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Total: ৳ {total}</h3>
              <button
                onClick={() => {
                  window.dispatchEvent(new Event("cartUpdated"));
                  router.push("/checkout");
                }}
                className="bg-green-500 text-white px-4 py-2 mt-3 rounded hover:bg-green-600 w-full"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
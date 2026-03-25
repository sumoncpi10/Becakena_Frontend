"use client";

import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data?.products || []);
      } catch (err) {
        console.error("❌ Error fetching products:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">

      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 bg-gray-100 p-4 rounded">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-4">

        {/* Hero Banner */}
        <div className="w-full">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNrM1b9TH2fYm4jD3XdEnw2axewYjuXXB1KP-NN1CYWGx5JDK9gRYqeyHBpGn1Smr5XXrFen0GckfRKLD7j7vhgvr9LC3wGbKc5JD_Pg&s=10"
            alt="Hero Banner"
            className="w-full h-40 md:h-64 lg:h-80 object-cover rounded"
          />
        </div>

        {/* Flash Sale Section */}
        <div className="bg-orange-400 text-white p-6 text-center text-xl md:text-2xl font-bold rounded">
          Flash Sale 🔥 Up to 50% OFF
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center text-lg font-semibold">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500">
            No products found
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
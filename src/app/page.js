"use client";

import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import FlashSale from "../components/FlashSale";


export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAllFlash, setShowAllFlash] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [categories] = useState([
    "Home",
    "Fashion",
    "Beauty",
    "Electronics",
    "SmartPhone",
    "Books",
    "Toys",
    "Sports",
    "Grocery",
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data?.products || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ CATEGORY FILTER (FIXED SAFE)
  const filteredProducts = selectedCategory
    ? products.filter(
        (p) =>
          (p.category?.name || "").toLowerCase() ===
          selectedCategory.toLowerCase()
      )
    : products;

  // 🔥 FLASH SALE = FIRST 6 PRODUCTS (SAFE)
  const flashSaleProducts = filteredProducts.slice(0, 5);

  const visibleFlashProducts = showAllFlash
    ? flashSaleProducts
    : flashSaleProducts.slice(0, 5);

  // 🛍 JUST FOR YOU
  const justForYouProducts = filteredProducts.slice(5);

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="flex flex-col md:flex-row gap-4 p-4">

        {/* Sidebar */}
        <aside className="hidden md:block md:w-64 bg-white p-4 rounded shadow">
          <Sidebar />
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col gap-6">

          {/* HERO */}
          <div className="rounded overflow-hidden shadow">
            <img
              src="https://img.lazcdn.com/us/domino/11fd9771-5231-41d0-ba11-247ba77a7dbb_BD-1976-688.jpg_2200x2200q80.jpg_.avif"
              className="w-full h-40 md:h-72 object-cover"
            />
          </div>

          {/* CATEGORIES */}
          <div className="bg-white p-3 rounded shadow">
            <h2 className="font-bold mb-2">Categories</h2>

            <div className="flex gap-3 overflow-x-auto">
              {categories.map((c, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedCategory(
                      selectedCategory === c ? "" : c
                    );
                    setShowAllFlash(false);
                  }}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === c
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 🔥 FLASH SALE */}
          <FlashSale
            products={visibleFlashProducts}
            onShowAll={() => setShowAllFlash(true)}
          />

          {/* 🛍 JUST FOR YOU */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-3">Just For You</h2>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {justForYouProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
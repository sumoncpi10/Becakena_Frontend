"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import API from "../../services/api";
import Sidebar from "@/components/Sidebar";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const selectedSubCategory = searchParams.get("sub") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED FILTER (YOUR DATA STRUCTURE)
  const filteredProducts = products.filter((p) => {
    const catId = p.category?._id;
    const subId = p.subCategory?._id;

    if (selectedCategory && String(catId) !== String(selectedCategory)) {
      return false;
    }

    if (selectedSubCategory && String(subId) !== String(selectedSubCategory)) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex gap-6 p-6">
      <Sidebar />

      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Products</h2>

        {loading ? (
          <p>Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white p-4 rounded shadow hover:shadow-md"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />

                <h3 className="font-semibold">{p.name}</h3>

                <p className="text-sm text-gray-500">
                  {p.category?.name}
                </p>

                <p className="text-sm text-gray-400">
                  {p.subCategory?.name}
                </p>

                <p className="text-gray-600 font-bold">৳ {p.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
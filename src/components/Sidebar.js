"use client";

import { useEffect, useState } from "react";
import API from "../services/api";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(null);

  // Fetch categories + subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/categories"); // your API
        setCategories(res.data.categories || []);
        setSubCategories(res.data.subCategories || []);
      } catch (err) {
        console.error("Load failed ❌", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle category
  const toggleCategory = (id) => {
    setActiveCat(activeCat === id ? null : id);
  };

  // Get subcategories by categoryId
  const getSubCategories = (catId) => {
    return subCategories.filter((sub) => sub.categoryId === catId);
  };

  return (
    <aside className="hidden md:block w-64 bg-gray-100 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>

      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">No categories found</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {categories.map((cat) => {
            const subs = getSubCategories(cat._id);

            return (
              <li key={cat._id}>
                {/* Category */}
                <div
                  onClick={() => toggleCategory(cat._id)}
                  className="cursor-pointer p-2 rounded hover:bg-orange-500 hover:text-white flex justify-between"
                >
                  <span>{cat.name}</span>
                  <span>{activeCat === cat._id ? "-" : "+"}</span>
                </div>

                {/* Subcategories */}
                {activeCat === cat._id && (
                  <ul className="ml-4 mt-1 flex flex-col gap-1">
                    {subs.length > 0 ? (
                      subs.map((sub) => (
                        <li
                          key={sub._id}
                          className="cursor-pointer p-2 rounded hover:bg-orange-400 hover:text-white text-sm"
                        >
                          {sub.name}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-sm">
                        No subcategories
                      </li>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
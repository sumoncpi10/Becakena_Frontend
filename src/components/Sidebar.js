"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "../services/api";

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(
    searchParams.get("category") || null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data.categories || []);
        setSubCategories(res.data.subCategories || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (catId) => {
    const isSame = activeCat === catId;

    const newCat = isSame ? "" : catId;

    setActiveCat(isSame ? null : catId);

    // reset subcategory when category changes
    router.push(newCat ? `/products?category=${newCat}` : `/products`);
  };

  const handleSubClick = (catId, subId) => {
    setActiveCat(catId);
    router.push(`/products?category=${catId}&sub=${subId}`);
  };

  const getSubCategories = (catId) => {
    return subCategories.filter((sub) => sub.categoryId === catId);
  };

  return (
    <aside className="w-64 bg-gray-100 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>

      {loading ? (
        <p>Loading...</p>
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
                          onClick={() => handleSubClick(cat._id, sub._id)}
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
"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function FlashSale({ products = [] }) {
  // 🔥 countdown (1 hour demo)
  const [time, setTime] = useState(3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="bg-white p-4 rounded shadow">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-3">

        <div>
          <h2 className="text-2xl font-bold text-orange-500">
            Flash Sale
          </h2>
          <p className="text-sm text-gray-500">On Sale Now</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-black text-white px-3 py-1 rounded">
            Ends in: {formatTime(time)}
          </div>

          <button className="text-orange-500 font-semibold">
            SHOP ALL PRODUCTS
          </button>
        </div>
      </div>

      {/* PRODUCTS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {products.map((p) => {
          const discount =
            p.oldPrice && p.price
              ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
              : 0;

          return (
            <div key={p._id} className="border rounded p-2 hover:shadow">
              <ProductCard product={p} />

              {/* PRICE BLOCK */}
              <div className="mt-2">
                <p className="text-orange-500 font-bold">
                  ৳ {p.price}
                </p>

                {p.oldPrice && (
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span className="line-through">
                      ৳ {p.oldPrice}
                    </span>

                    {discount > 0 && (
                      <span className="text-red-500 font-semibold">
                        -{discount}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
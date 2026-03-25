
"use client";
import { addToCart } from "../utils/cart";
export default function ProductCard({ product }) {
  return (
    <div className="bg-white shadow rounded p-3 hover:shadow-lg transition transform hover:-translate-y-1">
      
      {/* Product Image */}
      <img
        src={product.image || "https://via.placeholder.com/200"}
        alt={product.name}
        className="w-full h-40 sm:h-48 md:h-52 lg:h-56 object-cover rounded"
      />

      {/* Product Name */}
      <h3 className="font-semibold mt-2 text-sm sm:text-base md:text-lg truncate">
        {product.name}
      </h3>

      {/* Product Price */}
      <p className="text-orange-500 font-bold mt-1 text-sm sm:text-base">
        {product.price}৳
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={() => addToCart(product)}
        className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
      >
        Add to Cart 🛒
      </button>
    </div>
  );
}




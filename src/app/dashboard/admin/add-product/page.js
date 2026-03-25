"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../../../../services/api";

export default function AddProduct() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    categoryId: "",
    subCategoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  // 🔥 Load categories + subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data.categories || []);
        setSubCategories(res.data.subCategories || []);
      } catch (err) {
        console.error("Load failed ❌", err);
      }
    };

    fetchData();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset subcategory when category changes
    if (name === "categoryId") {
      setForm({
        ...form,
        categoryId: value,
        subCategoryId: "",
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // 🔥 Filter subcategories based on category
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.categoryId === form.categoryId
  );

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.categoryId) {
      alert("Name, Price & Category required!");
      return;
    }

    try {
      setLoading(true);

      await API.post("/products", form);

      alert("Product Added Successfully ✅");

      router.push("/dashboard/admin");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 w-full max-w-md rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add Product 📦
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          className="border p-3 mb-4 w-full rounded"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          className="border p-3 mb-4 w-full rounded"
        />

        {/* Image */}
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          className="border p-3 mb-4 w-full rounded"
        />

        {/* 🔥 Category Dropdown */}
        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="border p-3 mb-4 w-full rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* 🔥 Subcategory Dropdown */}
        <select
          name="subCategoryId"
          value={form.subCategoryId}
          onChange={handleChange}
          className="border p-3 mb-4 w-full rounded"
          disabled={!form.categoryId}
        >
          <option value="">Select Subcategory</option>
          {filteredSubCategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white w-full py-3 rounded"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../../services/api";

export default function AdminDashboard() {
  const router = useRouter();

  // --- Products ---
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // --- Categories & Subcategories ---
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // --- Vendors ---
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  // --- Dashboard analytics ---
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalOrders: 0,
  });

  // --- Token & Axios Config ---
  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const getConfig = () => ({
    headers: { Authorization: getToken() ? `Bearer ${getToken()}` : "" },
  });

  // --- Fetch all data ---
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await API.get("/products", getConfig());
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
      alert("Failed to load products ❌");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await API.get("/categories", getConfig());
      setCategories(res.data.categories);
      setSubCategories(res.data.subCategories || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load categories ❌");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchVendors = async () => {
    setLoadingVendors(true);
    try {
      const res = await API.get("/vendors", getConfig());
      setVendors(res.data.vendors);
    } catch (err) {
      console.error(err);
      alert("Failed to load vendors ❌");
    } finally {
      setLoadingVendors(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // You can fetch real analytics from backend
      // const res = await API.get("/analytics", getConfig());
      // setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchVendors();
    fetchAnalytics();
  }, []);

  // --- Add Category ---
  const addCategory = async () => {
    if (!newCategory) return alert("Category name required");
    try {
      await API.post("/categories", { name: newCategory }, getConfig());
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to add category ❌");
    }
  };

  // --- Add Subcategory ---
  const addSubCategory = async () => {
    if (!newSubCategory || !selectedCategory)
      return alert("Select category & subcategory name");
    try {
      await API.post(
        "/subcategories",
        { name: newSubCategory, categoryId: selectedCategory },
        getConfig()
      );
      setNewSubCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to add subcategory ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard 🛠️</h1>

      {/* --- Analytics --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Total Sales</h2>
          <p>৳ {analytics.totalSales}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Total Profit</h2>
          <p>৳ {analytics.totalProfit}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Total Orders</h2>
          <p>{analytics.totalOrders}</p>
        </div>
      </div>

      {/* --- Category Management --- */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Manage Categories</h2>

        {/* Add Category */}
        <div className="flex mb-3">
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border p-2 rounded mr-2 flex-1"
          />
          <button onClick={addCategory} className="bg-green-500 text-white px-3 py-1 rounded">
            Add Category
          </button>
        </div>

        {/* Add Subcategory */}
        <div className="flex items-center mb-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded mr-2 flex-1"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New Subcategory"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            className="border p-2 rounded mr-2 flex-1"
          />
          <button onClick={addSubCategory} className="bg-blue-500 text-white px-3 py-1 rounded">
            Add Subcategory
          </button>
        </div>

        {/* Show categories & subcategories */}
        <div>
          <h3 className="font-semibold mb-2">Categories & Subcategories</h3>
          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : categories.length === 0 ? (
            <p>No categories found</p>
          ) : (
            <ul>
              {categories.map((cat) => (
                <li key={cat._id} className="mb-2">
                  <strong>{cat.name}</strong>
                  {subCategories
                    .filter((sub) => sub.categoryId === cat._id)
                    .map((sub) => (
                      <ul key={sub._id} className="ml-4 list-disc">
                        <li>{sub.name}</li>
                      </ul>
                    ))}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* --- Vendor Management --- */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Vendors</h2>
        {loadingVendors ? (
          <p>Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <p>No vendors found</p>
        ) : (
          <ul>
            {vendors.map((v) => (
              <li key={v._id} className="border-b py-2 flex justify-between">
                <span>{v.storeName}</span>
                <span>{v.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- Product Management --- */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Products</h2>
        <button
          onClick={() => router.push("/dashboard/admin/add-product")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          + Add Product
        </button>
      </div>
      {loadingProducts ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded shadow hover:shadow-md transition">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-gray-600 mb-2">৳ {p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
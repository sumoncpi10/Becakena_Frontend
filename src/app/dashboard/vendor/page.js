"use client";

import { useEffect, useState } from "react";
import API from "../../../services/api";

export default function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [vendorInfo, setVendorInfo] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setVendorInfo(JSON.parse(atob(token.split(".")[1])));
      }
    }
  }, []);

  const getVendorId = () => vendorInfo?.id;

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data.categories || []);
        setSubCategories(res.data.subCategories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ FIX: safe compare
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.categoryId?.toString() === categoryId
  );

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      const vendorId = getVendorId();

      const myProducts = res.data.products.filter(
        (p) => p.vendor?._id === vendorId
      );

      setProducts(myProducts);
    } catch (err) {
      console.error(err);
      alert("Failed to load products ❌");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/vendor-orders");
      const vendorId = getVendorId();

      const ordersWithProducts = res.data.orders.map((order) => ({
        ...order,
        products: order.products.map((p) => ({
          ...p,
          isOwnProduct:
            p.vendor === vendorId || p.vendor?._id === vendorId,
        })),
      }));

      setOrders(ordersWithProducts);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders ❌");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (vendorInfo) {
      fetchProducts();
      fetchOrders();
    }
  }, [vendorInfo]);

  // ✅ FIXED handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !categoryId || !subCategoryId) {
      alert("Name, Price, Category & SubCategory required");
      return;
    }

    try {
      const payload = {
        name,
        price,
        image,
        category: categoryId,       // ✅ FIX
        subCategory: subCategoryId, // ✅ FIX
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
        alert("Product updated ✅");
      } else {
        await API.post("/products", payload);
        alert("Product added ✅");
      }

      // Reset
      setName("");
      setPrice("");
      setImage("");
      setCategoryId("");
      setSubCategoryId("");
      setEditingId(null);

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Operation failed ❌");
    }
  };

  // ✅ FIX edit
  const editProduct = (p) => {
    setEditingId(p._id);
    setName(p.name);
    setPrice(p.price);
    setImage(p.image || "");
    setCategoryId(p.category?._id || "");
    setSubCategoryId(p.subCategory?._id || "");
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure?")) return;

    try {
      await API.delete(`/products/${id}`);
      alert("Deleted Successfully ✅");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete Failed ❌");
    }
  };

  const updateOrderStatus = async (orderId, productId, status) => {
    try {
      await API.put(`/orders/${orderId}/product/${productId}`, { status });
      alert("Status updated ✅");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Status update failed ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard 🛒</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-lg mb-3">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />

        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setSubCategoryId("");
          }}
          className="border p-2 mb-2 w-full rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
          disabled={!categoryId}
        >
          <option value="">Select Subcategory</option>
          {filteredSubCategories.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <button className="bg-orange-500 text-white px-4 py-2 rounded">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

       {/* PRODUCTS */}
      <h2 className="text-xl font-bold mb-2">My Products</h2>
      {loadingProducts ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded shadow">
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-semibold">{p.name}</h3>
              <p>৳ {p.price}</p>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => editProduct(p)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ORDERS */}
      <h2 className="text-xl font-bold mb-2">Orders</h2>
      {loadingOrders ? (
        <p>Loading orders...</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded shadow">
              <p><strong>Order ID:</strong> {order._id}</p>

              {order.products.map((p) => (
                <div key={p._id} className="flex items-center gap-2">
                  {p.product?.name || "Unknown"} x {p.quantity}

                  {p.isOwnProduct ? (
                    <select
                      value={p.status || "Pending"}
                      onChange={(e) =>
                        updateOrderStatus(order._id, p._id, e.target.value)
                      }
                      className="border p-1 ml-2"
                    >
                      <option>Pending</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  ) : (
                    <span className="text-gray-500 ml-2">
                      ({p.status || "Pending"})
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
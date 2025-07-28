import React, { useState, useEffect } from "react";
import OrderTable from "./OrderTable";
import OrderStats from "./OrderStats";
import ProductManagement from "./ProductManagement"; // Yeni bileşeni içe aktar
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const adminUsername = localStorage.getItem("adminUsername") || "Admin";

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        timestamp: docSnap.data().timestamp, // Timestamp objesini koru
      }));
      setOrders(fetched);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (err) {
      console.error("Sipariş durumu güncellenirken hata:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Paneli</h1>
        <div className="admin-user-info">
          <span>Hoş Geldin, {adminUsername}</span>
          <button onClick={onLogout} className="logout-btn">
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Siparişler
        </button>
        <button
          className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          İstatistikler
        </button>
        {/* Yeni Ürünler Sekmesi */}
        <button
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Ürünler
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "orders" && (
          <OrderTable orders={orders} updateOrderStatus={updateOrderStatus} />
        )}

        {activeTab === "stats" && <OrderStats orders={orders} />}

        {/* Ürün Yönetimi Bileşenini Göster */}
        {activeTab === "products" && <ProductManagement />}
      </div>
    </div>
  );
}

export default AdminDashboard;

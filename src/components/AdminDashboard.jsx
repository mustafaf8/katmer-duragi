import React, { useState, useEffect } from "react";
import OrderTable from "./OrderTable";
import OrderStats from "./OrderStats";
import db from "../firebase";
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
    // Firestore'dan gerçek zamanlı sipariş dinle
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setOrders(fetched);
    });

    return () => unsubscribe();
  }, []);

  // Siparişin durumunu güncelle
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
      </div>

      <div className="admin-content">
        {activeTab === "orders" && (
          <OrderTable orders={orders} updateOrderStatus={updateOrderStatus} />
        )}

        {activeTab === "stats" && <OrderStats orders={orders} />}
      </div>
    </div>
  );
}

export default AdminDashboard;

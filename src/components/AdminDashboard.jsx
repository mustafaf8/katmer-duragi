import React, { useState, useEffect, useRef } from "react";
import OrderTable from "./OrderTable";
import OrderStats from "./OrderStats";
import ProductManagement from "./ProductManagement";
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

  const [audioPermission, setAudioPermission] = useState(false);
  const isInitialMount = useRef(true);
  const notificationSound = useRef(new Audio("/notification.wav"));

  // useEffect'in sadece component yüklendiğinde bir kez çalışmasını sağla
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Zil sesi çalma mantığını doküman değişikliklerine göre yap
      if (isInitialMount.current) {
        // İlk yüklemede tüm dokümanları al, sesi çalma
        isInitialMount.current = false;
      } else {
        // Sadece sonradan "eklenen" dokümanlar için işlem yap
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const newOrder = change.doc.data();
            // Sadece durumu "bekleyen" yeni bir sipariş ise zil çal
            if (newOrder.status === "pending") {
              console.log("Yeni sipariş algılandı, ses çalınıyor...");
              notificationSound.current.play().catch((error) => {
                console.error("Ses çalınamadı:", error);
              });
            }
          }
        });
      }

      // Sipariş listesini her zaman tam snapshot ile güncelle
      const fetchedOrders = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setOrders(fetchedOrders);
    });

    // Component DOM'dan kaldırıldığında dinleyiciyi temizle
    return () => unsubscribe();
  }, [audioPermission]); // Bağımlılık dizisini boş bırakarak bu hook'un sadece bir kez çalışmasını sağla

  const handleEnableAudio = () => {
    notificationSound.current.muted = true; // Sesi sessize al
    notificationSound.current
      .play()
      .then(() => {
        // Başarıyla çalındıktan sonra durdur ve sesi aç
        notificationSound.current.pause();
        notificationSound.current.currentTime = 0;
        notificationSound.current.muted = false;
        setAudioPermission(true); // İzin verildi olarak işaretle
        console.log("Sesli bildirimler etkinleştirildi.");
      })
      .catch((error) => {
        console.error("Ses etkinleştirme hatası:", error);
      });
  };

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

      {/* Ses Etkinleştirme Bildirimi */}
      {!audioPermission && (
        <div className="audio-permission-banner">
          <p>Yeni siparişler için sesli bildirim almak ister misiniz?</p>
          <button onClick={handleEnableAudio}>
            Bildirim Sesini Etkinleştir
          </button>
        </div>
      )}
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
        {activeTab === "products" && <ProductManagement />}
      </div>
    </div>
  );
}

export default AdminDashboard;

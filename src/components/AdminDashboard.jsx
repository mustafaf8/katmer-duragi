import React, { useState, useEffect } from "react";
import OrderTable from "./OrderTable";
import OrderStats from "./OrderStats";
// Firebase ve Firestore için gerekli fonksiyonları içe aktarın
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

  // useEffect ile component yüklendiğinde Firestore'dan verileri çek
  useEffect(() => {
    // 'orders' koleksiyonuna erişim için bir sorgu oluşturun
    // Siparişleri 'timestamp' alanına göre azalan sırada (en yeni en üstte) sırala
    const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));

    // onSnapshot ile koleksiyondaki değişiklikleri gerçek zamanlı olarak dinle
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Gelen veriyi (snapshot) alıp 'orders' state'ine uygun formata dönüştür
      const fetchedOrders = snapshot.docs.map((docSnap) => ({
        id: docSnap.id, // Belge ID'sini al (örn: 'aBCdEfgHiJkLmnOp')
        ...docSnap.data(), // Belgedeki diğer tüm verileri al (items, total, status vb.)
      }));

      // Siparişleri state'e kaydet
      setOrders(fetchedOrders);
    });

    // Component DOM'dan kaldırıldığında dinleyiciyi sonlandır (bellek sızıntısını önler)
    return () => unsubscribe();
  }, []); // Bu effect'in sadece component ilk yüklendiğinde bir kez çalışmasını sağlar

  // Siparişin durumunu (bekliyor/tamamlandı) güncelleyen fonksiyon
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Güncellenecek siparişin referansını al
      const orderRef = doc(db, "orders", orderId);
      // Firestore'daki 'status' alanını yeni değerle güncelle
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      console.error("Sipariş durumu güncellenirken hata:", err);
      // Burada kullanıcıya bir hata mesajı da gösterebilirsiniz.
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
          // Gerçek zamanlı 'orders' verisini ve güncelleme fonksiyonunu OrderTable'a prop olarak geç
          <OrderTable orders={orders} updateOrderStatus={updateOrderStatus} />
        )}

        {activeTab === "stats" && (
          // Gerçek zamanlı 'orders' verisini OrderStats'a prop olarak geç
          <OrderStats orders={orders} />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

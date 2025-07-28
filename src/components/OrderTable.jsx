import React, { useState } from "react";

function OrderTable({ orders, updateOrderStatus }) {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  // Siparişleri sıralarken timestamp'in varlığını kontrol et
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Firestore'dan gelen timestamp objesinin .toDate() metodunu kullan
    const dateA = a.timestamp ? a.timestamp.toDate() : new Date(0);
    const dateB = b.timestamp ? b.timestamp.toDate() : new Date(0);
    return dateB - dateA;
  });

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Tarih formatını düzenleyen fonksiyonu güncelle
  const formatDate = (timestamp) => {
    // Eğer timestamp ve toDate metodu yoksa, geçersiz tarih göstermesini engelle
    if (!timestamp || typeof timestamp.toDate !== "function") {
      return "Tarih bekleniyor...";
    }
    // Firestore timestamp objesini JavaScript Date objesine çevir
    const date = timestamp.toDate();
    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="order-table-container">
      <div className="order-filters">
        <h2>Siparişler</h2>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tümü
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Bekleyen
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Tamamlanan
          </button>
        </div>
      </div>

      {sortedOrders.length > 0 ? (
        <div className="orders-list">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className={`order-card ${
                order.status === "completed" ? "completed" : "pending"
              }`}
            >
              <div
                className="order-header"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="order-summary">
                  {/* Sipariş ID'sini gösteren satırı sildik */}
                  <span className="order-table">Masa {order.tableNumber}</span>
                  <span className="order-date">
                    {formatDate(order.timestamp)}
                  </span>
                </div>
                <div className="order-actions">
                  <span className="order-total">
                    {order.total.toFixed(2)} ₺
                  </span>
                  <span className={`order-status ${order.status}`}>
                    {order.status === "pending" ? "Bekliyor" : "Tamamlandı"}
                  </span>
                  <span className="expand-icon">
                    {expandedOrderId === order.id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="order-details">
                  <h3>Sipariş Detayları</h3>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Ürün</th>
                        <th>Adet</th>
                        <th>Fiyat</th>
                        <th>Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price.toFixed(2)} ₺</td>
                          <td>{(item.price * item.quantity).toFixed(2)} ₺</td>
                        </tr>
                      ))}
                      <tr className="total-row">
                        <td colSpan="3" className="total-label">
                          Toplam
                        </td>
                        <td className="total-value">
                          {order.total.toFixed(2)} ₺
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="order-status-actions">
                    {order.status === "pending" ? (
                      <button
                        className="complete-order-btn"
                        onClick={() => updateOrderStatus(order.id, "completed")}
                      >
                        Siparişi Tamamla
                      </button>
                    ) : (
                      <button
                        className="reopen-order-btn"
                        onClick={() => updateOrderStatus(order.id, "pending")}
                      >
                        Siparişi Yeniden Aç
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-orders-message">
          {filter === "all"
            ? "Henüz sipariş bulunmuyor."
            : filter === "pending"
            ? "Bekleyen sipariş bulunmuyor."
            : "Tamamlanan sipariş bulunmuyor."}
        </div>
      )}
    </div>
  );
}

export default OrderTable;

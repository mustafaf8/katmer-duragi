import React from "react";

function OrderStats({ orders }) {
  // Sipariş istatistiklerini hesapla
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  // Toplam geliri hesapla
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // En çok sipariş verilen masaları bul
  const tableOrderCounts = {};
  orders.forEach((order) => {
    tableOrderCounts[order.tableNumber] =
      (tableOrderCounts[order.tableNumber] || 0) + 1;
  });

  // Masaları sipariş sayısına göre sırala
  const sortedTables = Object.entries(tableOrderCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // En çok sipariş veren ilk 3 masa

  // En popüler ürünleri bul
  const itemPopularity = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      itemPopularity[item.name] =
        (itemPopularity[item.name] || 0) + item.quantity;
    });
  });

  // Ürünleri popülerliğe göre sırala
  const sortedItems = Object.entries(itemPopularity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // En popüler 5 ürün

  // Bugünün tarihini al
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Bugünkü siparişleri filtrele
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.timestamp);
    return orderDate >= today;
  });

  // Bugünkü geliri hesapla
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="order-stats-container">
      <h2>Sipariş İstatistikleri</h2>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Toplam Sipariş</h3>
            <p className="stat-value">{totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Bekleyen Sipariş</h3>
            <p className="stat-value">{pendingOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Tamamlanan Sipariş</h3>
            <p className="stat-value">{completedOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Toplam Gelir</h3>
            <p className="stat-value">{totalRevenue.toFixed(2)} ₺</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📆</div>
          <div className="stat-info">
            <h3>Bugünkü Gelir</h3>
            <p className="stat-value">{todayRevenue.toFixed(2)} ₺</p>
          </div>
        </div>
      </div>

      <div className="stats-details">
        <div className="popular-tables">
          <h3>En Aktif Masalar</h3>
          {sortedTables.length > 0 ? (
            <ul className="stats-list">
              {sortedTables.map(([table, count]) => (
                <li key={table} className="stats-list-item">
                  <span className="stats-item-name">Masa {table}</span>
                  <span className="stats-item-count">{count} sipariş</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">Henüz veri yok</p>
          )}
        </div>

        <div className="popular-items">
          <h3>En Popüler Ürünler</h3>
          {sortedItems.length > 0 ? (
            <ul className="stats-list">
              {sortedItems.map(([item, quantity]) => (
                <li key={item} className="stats-list-item">
                  <span className="stats-item-name">{item}</span>
                  <span className="stats-item-count">{quantity} adet</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">Henüz veri yok</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderStats;

import React, { useState, useEffect } from "react";
import { useCart } from "../hooks.js"; // hook dosyasından al
import Cart from "./Cart";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

function Menu({ onBack }) {
  const { addToCart, tableNumber, getCartItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuData, setMenuData] = useState([]); // Veriyi state olarak tut
  const [loading, setLoading] = useState(true); // Yüklenme durumu için

  // Arka plan rengini yönet
  useEffect(() => {
    document.body.style.backgroundColor = "transparent";
    return () => {
      document.body.style.backgroundColor = ""; // Orijinal stili geri yükle
    };
  }, []);

  // Firestore'dan menü verilerini çek
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "menuItems"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMenuData(items);
      setLoading(false);
    });

    return () => unsubscribe(); // Dinleyiciyi temizle
  }, []);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const handleAddToCart = (item) => addToCart(item);
  const cartItemCount = getCartItemCount();

  const categories = [
    "all",
    ...new Set(menuData.map((item) => item.category || "all")),
  ];
  const filteredItems =
    activeCategory === "all"
      ? menuData
      : menuData.filter((item) => item.category === activeCategory);

  return (
    <div className="menu-container">
      <div className="menu-hero">
        <div className="menu-hero-content">
          <h1>Katmer Durağı</h1>
          {tableNumber && (
            <p className="table-info-hero">Masa: {tableNumber}</p>
          )}
          <p className="menu-hero-description">
            Geleneksel lezzetler, modern sunum
          </p>
        </div>
      </div>

      <div className="menu-header">
        <h2>Lezzetli Menümüz</h2>
        <div className="menu-actions">
          <button className="cart-button" onClick={toggleCart}>
            <span className="cart-icon">🛒</span>
            <span>Sepet</span>
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </button>
          <button className="back-button" onClick={onBack}>
            Ana Sayfaya Dön
          </button>
        </div>
      </div>

      <div className="menu-categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category === "all" ? "Tümü" : category}
          </button>
        ))}
      </div>

      <div className="menu-items">
        {loading ? (
          <p>Menü yükleniyor...</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="menu-item">
              <div className="menu-item-image">
                <img src={item.image} alt={item.name} />
                {item.popular && <span className="popular-tag">Popüler</span>}
              </div>
              <div className="menu-item-info">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <div className="menu-item-footer">
                  <p className="price">
                    {item.price ? item.price.toFixed(2) : "0.00"} ₺
                  </p>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    <span className="add-icon">+</span> Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isCartOpen && <Cart onClose={toggleCart} />}
    </div>
  );
}

export default Menu;

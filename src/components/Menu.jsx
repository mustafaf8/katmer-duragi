import React, { useState } from "react";
import menuData from "../menuData";
import { useCart } from "../hooks.js";
import Cart from "./Cart";

function Menu({ onBack }) {
  const { addToCart, tableNumber, getCartItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Body arka plan rengini geçersiz kılmak için useEffect ekleyelim
  React.useEffect(() => {
    // Önceki body stilini saklayalım
    const originalBodyStyle = document.body.style.backgroundColor;

    // Body arka plan rengini geçici olarak şeffaf yapalım
    document.body.style.backgroundColor = "transparent";

    // Component kaldırıldığında orijinal stili geri yükleyelim
    return () => {
      document.body.style.backgroundColor = originalBodyStyle;
    };
  }, []);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const cartItemCount = getCartItemCount();

  // Tüm kategorileri al
  const categories = [
    "all",
    ...new Set(menuData.map((item) => item.category || "all")),
  ];

  // Aktif kategoriye göre filtrelenmiş menü öğeleri
  const filteredItems =
    activeCategory === "all"
      ? menuData
      : menuData.filter((item) => item.category === activeCategory);

  return (
    <div className="menu-container">
      {/* Hero Bölümü */}
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

      {/* Header Bölümü */}
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

      {/* Kategori Filtreleme */}
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

      {/* Menü Öğeleri */}
      <div className="menu-items">
        {filteredItems.map((item) => (
          <div key={item.id} className="menu-item">
            <div className="menu-item-image">
              <img src={item.image} alt={item.name} />
              {item.popular && <span className="popular-tag">Popüler</span>}
            </div>
            <div className="menu-item-info">
              <h3>{item.name}</h3>
              <p className="description">{item.description}</p>
              <div className="menu-item-footer">
                <p className="price">{item.price.toFixed(2)} ₺</p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  <span className="add-icon">+</span> Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Bölümü */}
      <div className="menu-footer">
        <p>Sipariş veya sorularınız için personelimize danışabilirsiniz.</p>
        <p>© {new Date().getFullYear()} Katmer Durağı - Tüm Hakları Saklıdır</p>
      </div>

      {isCartOpen && <Cart onClose={toggleCart} />}
    </div>
  );
}

export default Menu;

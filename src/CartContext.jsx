import React, { useState, useEffect } from "react";
import Toast from "./components/Toast";
import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CartContext } from "./hooks";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // URL'den masa numarasını al
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (table) {
      setTableNumber(parseInt(table, 10) || null);
    }
  }, []);

  // Toast gösterme fonksiyonu
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Toast'u kapat
  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  // Sepete ürün ekle
  const addToCart = (item) => {
    setCart((currentCart) => {
      // Ürün zaten sepette var mı kontrol et
      const existingItemIndex = currentCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex > -1) {
        // Ürün zaten sepette, miktarını artır
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        showToast(`${item.name} sepete eklendi!`, "success");
        return updatedCart;
      } else {
        // Ürün sepette değil, ekle
        showToast(`${item.name} sepete eklendi!`, "success");
        return [...currentCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Sepetten ürün çıkar
  const removeFromCart = (itemId) => {
    const itemToRemove = cart.find((item) => item.id === itemId);
    if (itemToRemove) {
      showToast(`${itemToRemove.name} sepetten çıkarıldı!`, "error");
    }

    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  };

  // Ürün miktarını azalt
  const decreaseQuantity = (itemId) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(
        (cartItem) => cartItem.id === itemId
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...currentCart];
        if (updatedCart[existingItemIndex].quantity > 1) {
          // Miktarı 1'den fazlaysa azalt
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity - 1,
          };
          showToast(
            `${updatedCart[existingItemIndex].name} miktarı azaltıldı!`,
            "info"
          );
          return updatedCart;
        } else {
          // Miktar 1 ise ürünü sepetten çıkar
          showToast(
            `${currentCart[existingItemIndex].name} sepetten çıkarıldı!`,
            "error"
          );
          return currentCart.filter((item) => item.id !== itemId);
        }
      }
      return currentCart;
    });
  };

  // Siparişi onayla
  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      await addDoc(collection(db, "orders"), {
        tableNumber,
        items: cart,
        total: getTotalPrice(),
        status: "pending",
        timestamp: serverTimestamp(),
      });

      setOrderPlaced(true);
      showToast("Siparişiniz alındı! Teşekkürler.", "success");

      // Sepeti temizle
      setCart([]);

      // orderPlaced bayrağını geri sıfırla
      setTimeout(() => setOrderPlaced(false), 3000);
    } catch (error) {
      console.error("Sipariş kaydedilirken hata:", error);
      showToast("Sipariş kaydedilemedi. Lütfen tekrar deneyin.", "error");
    }
  };

  // Toplam fiyatı hesapla
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Sepetteki toplam ürün sayısını hesapla
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    tableNumber,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    placeOrder,
    getTotalPrice,
    getCartItemCount,
    orderPlaced,
    showToast,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </CartContext.Provider>
  );
};

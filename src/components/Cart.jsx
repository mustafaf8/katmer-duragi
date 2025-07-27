import React, { useState } from "react";
import { useCart } from "../CartContext.jsx";

function Cart({ onClose }) {
  const {
    cart,
    tableNumber,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    placeOrder,
    getTotalPrice,
    orderPlaced,
  } = useCart();

  const [orderConfirmation, setOrderConfirmation] = useState(false);

  // Sipariş boş mu kontrolü
  const isCartEmpty = cart.length === 0;

  // Siparişi onayla
  const handlePlaceOrder = () => {
    if (isCartEmpty) return;

    if (!orderConfirmation) {
      setOrderConfirmation(true);
    } else {
      placeOrder();
      setOrderConfirmation(false);
    }
  };

  // Siparişi iptal et
  const handleCancelOrder = () => {
    setOrderConfirmation(false);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Sepetiniz</h2>
        {tableNumber && <p className="table-number">Masa: {tableNumber}</p>}
        <button className="close-cart" onClick={onClose}>
          ✕
        </button>
      </div>

      {isCartEmpty ? (
        <div className="empty-cart">
          <p>Sepetiniz boş.</p>
        </div>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">
                  {(item.price * item.quantity).toFixed(2)} ₺
                </p>
              </div>
              <div className="cart-item-actions">
                <button
                  className="quantity-btn"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>
                <span className="item-quantity">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => addToCart(item)}
                >
                  +
                </button>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Kaldır
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isCartEmpty && (
        <div className="cart-summary">
          <div className="cart-total">
            <h3>Toplam:</h3>
            <h3>{getTotalPrice().toFixed(2)} ₺</h3>
          </div>

          {orderConfirmation ? (
            <div className="order-confirmation">
              <p>Siparişi onaylıyor musunuz?</p>
              <div className="confirmation-buttons">
                <button
                  className="confirm-order-btn"
                  onClick={handlePlaceOrder}
                >
                  Siparişi Onayla
                </button>
                <button
                  className="cancel-order-btn"
                  onClick={handleCancelOrder}
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={orderPlaced}
            >
              {orderPlaced ? "Sipariş Alındı!" : "Sipariş Ver"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;

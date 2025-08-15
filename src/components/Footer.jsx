import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Footer({ onAdminClick }) {
  // 2. E-posta giriş alanının durumunu tutmak için bir state oluşturun
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // Kullanıcıya geri bildirim mesajı için

  // 3. Form gönderildiğinde çalışacak fonksiyon
  const handleSubscription = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    if (!email) {
      setMessage("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    try {
      // "users" koleksiyonuna yeni bir doküman ekle
      await addDoc(collection(db, "users"), {
        email: email,
        kayitTarihi: serverTimestamp(), // Kayıt tarihini sunucu zamanı olarak ekle
      });
      setMessage("Başarıyla abone oldunuz! Teşekkürler.");
      setEmail(""); // Giriş alanını temizle
    } catch (error) {
      console.error("Veritabanına yazarken hata oluştu: ", error);
      setMessage("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }

    // Mesajı birkaç saniye sonra temizle
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };
  return (
    <footer id="contact">
      <div className="footer">
        <div className="sub">
          <h2>Katmer Durağı'nın Tadı Damağınızda Kalacak!</h2>
          <p>Haberler, fırsatlar ve özel menü önerileri için abone olun.</p>
          <form onSubmit={handleSubscription}>
            <input
              className="contact-form"
              type="email"
              placeholder="  E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn2">
              Abone Ol
            </button>
          </form>
          {/* Geri bildirim mesajını göster */}
          {message && <p className="feedback-message">{message}</p>}
        </div>
        <div className="A">
          <div className="footer-buttons">
            <div
              className="footer-admin-btn"
              onClick={onAdminClick}
              style={{ opacity: 0.7 }}
            >
              Giriş Yap
            </div>
            <div className="footer-admin-btn" onClick={onAdminClick}>
              <a href="">Instagram</a>
            </div>
          </div>
          <div className="logoss">
            © 2023 Katmer Durağı. Tüm Hakları Saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

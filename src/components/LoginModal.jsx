import React, { useState } from "react";

function LoginModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basit doğrulama
    if (!username || !password) {
      setErrorMessage("Lütfen tüm alanları doldurun");
      return;
    }
    
    // Burada gerçek bir kimlik doğrulama işlemi yapılabilir
    // Şimdilik sadece başarılı giriş mesajı gösterelim
    alert("Başarıyla giriş yapıldı!");
    onClose();
  };

  return (
    <div id="loginModal" className="modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Giriş Yap</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Kullanıcı Adı" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Şifre" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
            <button type="submit">Giriş Yap</button>
          </div>
        </form>
        <p className="toggle-modal" style={{ textAlign: "center" }}>
          Katmer Durağı'na hoş geldiniz!
        </p>
      </div>
    </div>
  );
}

export default LoginModal;

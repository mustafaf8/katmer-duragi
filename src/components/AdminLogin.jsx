import React, { useState } from "react";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo için basit kimlik doğrulama - gerçek uygulamada bu bir backend API isteği olurdu
    if (username === "admin" && password === "admin123") {
      // Admin bilgilerini localStorage'a kaydet
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminUsername", username);

      // Giriş başarılı
      onLogin();
    } else {
      setError("Geçersiz kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Girişi</h2>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;

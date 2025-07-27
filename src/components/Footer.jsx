import React from "react";

function Footer({ onLoginClick, onAdminClick }) {
  return (
    <div className="footer">
      <div className="sub">
        <h2>Katmer Durağı'nın Tadı Damağınızda Kalacak!</h2>
        <p>Haberler, fırsatlar ve özel menü önerileri için abone olun.</p>
        <span>
          <input type="email" placeholder="  E-posta adresiniz" />
          <button className="btn2">ABONE OL</button>
        </span>
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
  );
}

export default Footer;

<div className="A">
  <div className="footer-buttons"></div>
  <div className="logoss">© 2023 Katmer Durağı. Tüm Hakları Saklıdır.</div>
</div>;

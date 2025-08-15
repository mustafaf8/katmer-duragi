import React from "react";
import logo from "../assets/logogo1.webp";

function Header({ isMenuOpen, setIsMenuOpen, showMenuPage }) {
  // Hamburger menü tıklandığında menünün durumunu değiştirir
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <img className="logo" src={logo} alt="logo" />

      <div className={`nvgtn-btn ${isMenuOpen ? "active" : ""}`}>
        <nav className="nvgtn">
          <ul>
            <li>
              <a href="#about" onClick={() => setIsMenuOpen(false)}>
                Hakkımızda
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => setIsMenuOpen(false)}>
                İletişim
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => {
                  setIsMenuOpen(false);
                  showMenuPage();
                }}
              >
                Menü
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Hamburger butonu */}
      <button className="hamburger" id="hamburger-btn" onClick={toggleMenu}>
        ☰
      </button>
    </header>
  );
}

export default Header;

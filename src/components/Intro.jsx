import React from "react";
import screen1 from "../assets/screen1.webp";

function Intro({ showMenuPage }) {
  return (
    <div className="intro">
      <div className="intro-left">
        <h2 className="hidden">KATMER DURAĞI</h2>
        <p className="hidden">
          Geleneksel lezzetleri modern sunumlarla buluşturan Katmer Durağı, taze
          malzemelerle hazırlanan özel tatlılarıyla damak zevkinize hitap
          ediyor. Eşsiz katmer çeşitlerimizi keşfedin.
        </p>
        <div className="intro-buttons hidden">
          <button className="intro-left-btn order-now" onClick={showMenuPage}>
            <a>Sipariş Ver</a>
          </button>
        </div>
      </div>
      <div className="intro-right">
        <img
          className="image hidden"
          src={screen1}
          alt="Uygulama Ekran Görüntüsü"
        />
      </div>
    </div>
  );
}

export default Intro;

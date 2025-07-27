import React from 'react';
import screen4 from '../assets/screen4.png';

function About() {
  return (
    <div className="about" id="about">
      <div className="about-view">
        <div className="about-top">
          <p className="hidden">Geleneksel Lezzetler</p>
          <h2 className="hidden">Katmer Durağı olarak, geleneksel Türk tatlılarını modern bir yaklaşımla sunuyoruz. Taze ve kaliteli malzemelerle hazırlanan katmerlerimiz, damak zevkinize hitap edecek.</h2>                         
        </div>
        <div className="about-bottom">
          <img className="image" src={screen4} alt="Raporlar gösterge paneli" />
        </div>
      </div>
    </div>
  );
}

export default About;
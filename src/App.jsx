import React, { useState, useEffect } from "react";
import { CartProvider } from "./CartContext.jsx";

// Bileşenleri import et
import Header from "./components/Header";
import Intro from "./components/Intro";
import About from "./components/About";
import Features from "./components/Features";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import Menu from "./components/Menu";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  // Modalların ve menünün açık/kapalı durumunu tutan state'ler
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuPageVisible, setMenuPageVisible] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // URL'deki masa numarasını kontrol et
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");

    // Eğer URL'de masa numarası varsa doğrudan menü sayfasını göster
    if (table) {
      setMenuPageVisible(true);
    }

    // Admin giriş durumunu localStorage'dan kontrol et
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (adminLoggedIn) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const showMenuPage = () => setMenuPageVisible(true);
  const showHomePage = () => {
    setMenuPageVisible(false);
    // URL'deki masa numarasını temizle (yalnızca geçmiş değişikliği, sayfa yenilenmez)
    window.history.pushState({}, "", window.location.pathname);
  };

  const handleAdminLogin = () => {
    setIsAdminLoginOpen(false);
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUsername");
    setIsAdminLoggedIn(false);
  };

  // Animasyonları yeniden tetiklemek için useEffect hook'unu güncelliyoruz
  useEffect(() => {
    // Menü sayfasından ana sayfaya dönüldüğünde animasyonları sıfırla
    if (!isMenuPageVisible) {
      // Önce tüm görünür sınıflarını kaldır
      const visibleElements = document.querySelectorAll(".visible");
      visibleElements.forEach((el) => el.classList.remove("visible"));

      // Kısa bir gecikme ile observer'ı yeniden başlat
      const timer = setTimeout(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
              }
            });
          },
          { threshold: 0.1 }
        );

        const hiddenElements = document.querySelectorAll(".hidden");
        hiddenElements.forEach((el) => observer.observe(el));

        // Temizleme fonksiyonu
        return () => {
          hiddenElements.forEach((el) => observer.unobserve(el));
          observer.disconnect();
        };
      }, 100); // 100ms gecikme ile yeniden başlat

      // Timer'ı temizle
      return () => clearTimeout(timer);
    }
  }, [isMenuPageVisible]); // isMenuPageVisible değiştiğinde effect'i yeniden çalıştır

  // CartProvider ile tüm uygulamayı sarmala
  return (
    <CartProvider>
      {isAdminLoggedIn ? (
        <AdminDashboard onLogout={handleAdminLogout} />
      ) : isAdminLoginOpen ? (
        <AdminLogin onLogin={handleAdminLogin} />
      ) : isMenuPageVisible ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "auto",
          }}
        >
          <Menu onBack={showHomePage} />
        </div>
      ) : (
        <>
          <div className="home">
            <Header
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              showMenuPage={showMenuPage}
            />
            <Intro showMenuPage={showMenuPage} />
          </div>

          <About />
          <Features />
          <Footer
            onLoginClick={() => setIsLoginModalOpen(true)}
            onAdminClick={() => setIsAdminLoginOpen(true)}
          />

          {isLoginModalOpen && (
            <LoginModal onClose={() => setIsLoginModalOpen(false)} />
          )}
        </>
      )}
    </CartProvider>
  );
}

export default App;

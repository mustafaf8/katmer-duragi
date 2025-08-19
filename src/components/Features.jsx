// Resimleri import ediyoruz
import screen5 from "../../public/assets/screen5.png";
import screen8 from "../../public/assets/screen8.png";
import screen9 from "../../public/assets/screen9.png";
import screen6 from "../../public/assets/screen6.jpg";
import screen7 from "../../public/assets/screen7.jpg";

function Features() {
  return (
    <div className="features" id="features">
      <div className="features-view">
        <div className="first">
          <div className="left">
            <h2 className="hidden">Taze Malzemeler ve Özel Tarifler</h2>
            <p>
              Her gün taze malzemelerle hazırlanan katmerlerimiz, geleneksel
              tariflere sadık kalınarak üretilmektedir. Kaliteden ödün vermeden
              sunduğumuz lezzetlerimizi keşfedin.
            </p>
          </div>
          <div className="right">
            <img
              className="image"
              src={screen5}
              alt="Tarif detayları"
              loading="lazy"
            />
          </div>
        </div>

        <div className="first">
          <div className="right">
            <img
              className="image"
              src={screen8}
              alt="Satış grafiği"
              loading="lazy"
            />
          </div>
          <div className="left">
            <h2 className="hidden">Özel Siparişler ve Etkinlikler</h2>
            <p>
              Doğum günü, düğün ve özel etkinlikleriniz için sipariş
              verebilirsiniz. Size özel hazırlanan katmerlerimizle
              misafirlerinizi etkileyebilirsiniz.
            </p>
          </div>
        </div>

        <div className="first">
          <div className="left">
            <h2 className="hidden">Ev Yapımı Lezzetler</h2>
            <p>
              Ev yapımı tadında, katkı maddesiz ve doğal malzemelerle hazırlanan
              katmerlerimiz, sizi çocukluğunuza götürecek. Nostaljik lezzetleri
              modern sunumlarla keşfedin.
            </p>
          </div>
          <div className="right">
            <img
              className="image"
              src={screen9}
              alt="Malzemeler"
              loading="lazy"
            />
          </div>
        </div>

        <div className="first firstt">
          <div className="features-content">
            <h2>Hızlı Teslimat</h2>
            <p>
              Siparişleriniz en kısa sürede hazırlanıp adresinize teslim edilir.
              Sıcak ve taze katmerleriniz kapınızda.
            </p>
          </div>
          <div className="features-content">
            <h2>Özel Paketleme</h2>
            <p>
              Ürünlerimiz özel paketleme ile tazeliğini koruyarak size
              ulaştırılır. Hediye olarak da gönderebilirsiniz.
            </p>
          </div>
          <div className="features-content">
            <h2>Mobil Sipariş</h2>
            <p>
              Mobil uygulamamız ile dilediğiniz yerden kolayca sipariş
              verebilirsiniz. Tek tıkla lezzetlerimize ulaşın.
            </p>
          </div>
        </div>

        <div className="first">
          <div className="right">
            <img
              className="image"
              src={screen6}
              alt="Fresh bread"
              loading="lazy"
            />
          </div>
          <div className="left">
            <h2 className="hidden">Cay sociis nato que penatibus et</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique.
            </p>
          </div>
        </div>

        <div className="first">
          <div className="left">
            <h2 className="hidden">Cay sociis nato que penatibus et</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique.
            </p>
          </div>
          <div className="right">
            <img
              className="image"
              src={screen7}
              alt="Salad and burger"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;

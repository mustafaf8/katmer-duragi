import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, addDoc, updateDoc, collection } from "firebase/firestore";

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// existingCategories prop'unu ekledik
function ProductForm({ productToEdit, existingCategories, onClose }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    popular: false,
  });

  // Yeni kategori girişi için state
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
      // Eğer düzenlenen ürünün kategorisi mevcut listede yoksa, "yeni kategori" seçeneğini aktif et
      if (
        productToEdit.category &&
        !existingCategories.includes(productToEdit.category)
      ) {
        setShowNewCategoryInput(true);
        setNewCategory(productToEdit.category);
      }
    }
  }, [productToEdit, existingCategories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = name === "price" ? Math.max(0, Number(value)) : value;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : val,
    }));
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    if (value === "addNew") {
      setShowNewCategoryInput(true);
      setProduct((prev) => ({ ...prev, category: "" }));
    } else {
      setShowNewCategoryInput(false);
      setNewCategory("");
      setProduct((prev) => ({ ...prev, category: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 700 * 1024) {
      setErrorMessage(
        "Resim boyutu çok büyük! Lütfen 700KB'den küçük bir resim seçin."
      );
      return;
    }
    setErrorMessage("");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProduct((prev) => ({ ...prev, image: reader.result }));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Kategori seçimi kontrolü
    const finalCategory = showNewCategoryInput
      ? newCategory.trim()
      : product.category;
    if (!finalCategory) {
      setErrorMessage(
        "Lütfen bir kategori seçin veya yeni bir kategori girin."
      );
      setIsProcessing(false);
      return;
    }

    if (!product.image) {
      setErrorMessage("Lütfen bir ürün resmi seçin.");
      setIsProcessing(false);
      return;
    }

    const productData = {
      ...product,
      price: Number(product.price),
      category: finalCategory,
    };

    try {
      if (productToEdit) {
        const productRef = doc(db, "menuItems", productToEdit.id);
        await updateDoc(productRef, productData);
      } else {
        await addDoc(collection(db, "menuItems"), productData);
      }
      onClose();
    } catch (error) {
      console.error("İşlem sırasında hata:", error);
      setErrorMessage("Veritabanı hatası: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="product-form-modal-overlay">
      <div className="product-form-modal-content">
        <button onClick={onClose} className="close-form-btn">
          <CloseIcon />
        </button>
        <h3>{productToEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h3>

        <form onSubmit={handleSubmit} className="product-form">
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          )}

          <div className="form-group">
            <label htmlFor="name">Ürün Adı</label>
            <input
              id="name"
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Örn: Fıstıklı Katmer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Ürünle ilgili kısa bir açıklama"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Fiyat (₺)</label>
              <input
                id="price"
                type="number"
                step="0.01"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Kategori Dropdown */}
            <div className="form-group">
              <label htmlFor="category">Kategori</label>
              <select
                id="category"
                name="category"
                value={showNewCategoryInput ? "addNew" : product.category}
                onChange={handleCategoryChange}
                required
              >
                <option value="" disabled>
                  Kategori Seçin
                </option>
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option
                  value="addNew"
                  style={{ fontStyle: "italic", color: "#dd1173" }}
                >
                  + Yeni Kategori Ekle
                </option>
              </select>
            </div>
          </div>

          {/* Yeni Kategori Giriş Alanı */}
          {showNewCategoryInput && (
            <div className="form-group">
              <label htmlFor="newCategory">Yeni Kategori Adı</label>
              <input
                id="newCategory"
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Yeni kategoriyi yazın"
                required
              />
            </div>
          )}

          <div className="form-group file-input-group">
            <label htmlFor="image">Ürün Resmi (Max: 700KB)</label>
            <div className="file-input-wrapper">
              <input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="file-input-hidden"
              />
              <label htmlFor="image" className="file-input-label">
                Resim Seç veya Değiştir
              </label>
              {product.image && (
                <img
                  src={product.image}
                  alt="Önizleme"
                  className="image-preview"
                />
              )}
            </div>
          </div>

          <div className="form-group-checkbox">
            <input
              id="popular"
              type="checkbox"
              name="popular"
              checked={product.popular}
              onChange={handleChange}
            />
            <label htmlFor="popular">Popüler ürün olarak işaretle</label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              İptal
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="spinner"></div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                "Kaydet"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;

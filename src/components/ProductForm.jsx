import React, { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig";
import { doc, addDoc, updateDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Basit bir "X" ikonu
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

function ProductForm({ productToEdit, onClose }) {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    popular: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
      if (productToEdit.image) {
        setImagePreview(productToEdit.image);
      }
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Fiyat alanının negatif olmamasını sağla
    const val = name === "price" ? Math.max(0, Number(value)) : value;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : val,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Resim önizlemesi için
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let imageUrl = product.image;

    if (imageFile) {
      const imageRef = ref(
        storage,
        `menuItems/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const productData = {
      ...product,
      price: Number(product.price),
      image: imageUrl,
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
    } finally {
      setIsUploading(false);
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
            <div className="form-group">
              <label htmlFor="category">Kategori</label>
              <input
                id="category"
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
                placeholder="Örn: Tatlı"
                required
              />
            </div>
          </div>

          <div className="form-group file-input-group">
            <label htmlFor="image">Ürün Resmi</label>
            <div className="file-input-wrapper">
              <input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="file-input-hidden"
              />
              <label htmlFor="image" className="file-input-label">
                {imageFile ? imageFile.name : "Resim Seç veya Değiştir"}
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
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
            <button type="submit" className="btn-submit" disabled={isUploading}>
              {isUploading ? (
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

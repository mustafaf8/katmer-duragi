import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import ProductForm from "./ProductForm"; // Birazdan oluşturacağımız bileşen

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "menuItems"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setProductToEdit(null);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "menuItems", id));
        // Not: Resmin Storage'dan silinmesi de eklenebilir.
      } catch (error) {
        console.error("Ürün silinirken hata:", error);
      }
    }
  };

  return (
    <div className="product-management">
      <h2>Ürün Yönetimi</h2>
      <button onClick={handleAddNew} className="add-new-btn">
        Yeni Ürün Ekle
      </button>

      {isFormVisible && (
        <ProductForm
          productToEdit={productToEdit}
          onClose={() => setIsFormVisible(false)}
        />
      )}

      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-list-item">
            <img src={product.image} alt={product.name} width="100" />
            <div className="product-details">
              <h4>{product.name}</h4>
              <p>{product.price.toFixed(2)} ₺</p>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEdit(product)}>Düzenle</button>
              <button onClick={() => handleDelete(product.id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductManagement;

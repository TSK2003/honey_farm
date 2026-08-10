import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0].url);
        } else {
          setActiveImage('/images/product-natural-honey.png');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (!product) return <div className="container section"><div className="empty-state"><h3>Product Not Found</h3><Link to="/shop" className="btn btn-primary">Back to Shop</Link></div></div>;

  const discountPercent = selectedVariant && selectedVariant.mrp > selectedVariant.price
    ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.stock > 0) {
      addToCart(product, selectedVariant, quantity);
      addToast(`Added ${quantity} × ${product.name} (${selectedVariant.weight}) to cart`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant && selectedVariant.stock > 0) {
      addToCart(product, selectedVariant, quantity);
      navigate('/checkout');
    }
  };

  return (
    <div className="product-page section">
      <style>{`
        .product-grid-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 48px;
        }
        .gallery-main {
          aspect-ratio: 1;
          background: #FBF8F3;
          border: 1px solid #E5E0D8;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .gallery-main img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .gallery-thumbs {
          display: flex;
          gap: 12px;
        }
        .thumb-item {
          width: 70px;
          height: 70px;
          border-radius: 6px;
          border: 1px solid #E5E0D8;
          overflow: hidden;
          cursor: pointer;
        }
        .thumb-item.active {
          border-color: #C17817;
          border-width: 2px;
        }
        .thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-info-title {
          font-size: 28px;
          font-weight: 700;
          color: #2C1810;
          margin-bottom: 8px;
        }
        .product-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          font-size: 13px;
        }
        .product-price-box {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 24px;
          background: #FFF8ED;
          padding: 16px;
          border-radius: 6px;
          border: 1px solid #F0D48A;
        }
        .price-large {
          font-size: 32px;
          font-weight: 700;
          color: #2C1810;
        }
        .mrp-large {
          font-size: 18px;
          color: #8B7B6B;
          text-decoration: line-through;
        }
        .discount-badge {
          font-size: 12px;
          font-weight: 700;
          color: #4A7C59;
          background: #E8F5E9;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .variant-selector {
          margin-bottom: 24px;
        }
        .variant-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .variant-options {
          display: flex;
          gap: 12px;
        }
        .variant-btn {
          padding: 8px 16px;
          border: 1px solid #E5E0D8;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          background: white;
        }
        .variant-btn.active {
          border-color: #C17817;
          background: #FFF8ED;
          color: #C17817;
          font-weight: 600;
        }
        .qty-picker {
          display: flex;
          align-items: center;
          border: 1px solid #E5E0D8;
          border-radius: 5px;
          width: fit-content;
        }
        .qty-btn {
          padding: 8px 14px;
          font-size: 16px;
          cursor: pointer;
        }
        .qty-val {
          padding: 0 16px;
          font-weight: 600;
        }
        .tab-nav {
          display: flex;
          gap: 24px;
          border-bottom: 1px solid #E5E0D8;
          margin-bottom: 24px;
        }
        .tab-btn {
          padding: 12px 0;
          font-size: 15px;
          font-weight: 600;
          color: #8B7B6B;
          border-bottom: 2px solid transparent;
          cursor: pointer;
        }
        .tab-btn.active {
          color: #C17817;
          border-bottom-color: #C17817;
        }
        @media (max-width: 768px) {
          .product-grid-layout { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container">
        {/* Main Product Layout */}
        <div className="product-grid-layout">
          {/* Gallery */}
          <div>
            <div className="gallery-main">
              <img src={activeImage} alt={product.name} />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="gallery-thumbs">
                {product.images.map((img, i) => (
                  <div 
                    key={i} 
                    className={`thumb-item ${activeImage === img.url ? 'active' : ''}`}
                    onClick={() => setActiveImage(img.url)}
                  >
                    <img src={img.url} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="product-info-title">{product.name}</h1>
            <div className="product-meta">
              <span style={{ color: '#D4A24E' }}>★ {product.rating || '5.0'} ({product.review_count || 3} reviews)</span>
              <span>Category: <strong>{product.category_name}</strong></span>
            </div>

            {/* Price Box */}
            <div className="product-price-box">
              <span className="price-large">₹{selectedVariant?.price}</span>
              {selectedVariant?.mrp > selectedVariant?.price && (
                <span className="mrp-large">₹{selectedVariant.mrp}</span>
              )}
              {discountPercent > 0 && (
                <span className="discount-badge">Save {discountPercent}%</span>
              )}
            </div>

            {/* Weight Selection */}
            <div className="variant-selector">
              <div className="variant-title">Select Net Weight:</div>
              <div className="variant-options">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    className={`variant-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v.weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <div className="variant-title">Quantity:</div>
              <div className="qty-picker">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span className="qty-val">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}>+</button>
              </div>
            </div>

            {/* Stock status */}
            <div style={{ marginBottom: '24px', fontSize: '13px' }}>
              {selectedVariant?.stock > 0 ? (
                <span style={{ color: '#4A7C59', fontWeight: 600 }}>✓ In Stock ({selectedVariant.stock} available)</span>
              ) : (
                <span style={{ color: '#C44B3F', fontWeight: 600 }}>✕ Out of Stock</span>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                className="btn btn-primary btn-lg" 
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock <= 0}
              >
                ADD TO CART
              </button>
              <button 
                className="btn btn-secondary btn-lg" 
                style={{ flex: 1 }}
                onClick={handleBuyNow}
                disabled={!selectedVariant || selectedVariant.stock <= 0}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div>
          <div className="tab-nav">
            <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
            <button className={`tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`} onClick={() => setActiveTab('ingredients')}>Ingredients</button>
            <button className={`tab-btn ${activeTab === 'storage' ? 'active' : ''}`} onClick={() => setActiveTab('storage')}>Storage & Shipping</button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Customer Reviews ({product.reviews?.length || 0})</button>
          </div>

          <div style={{ background: '#FFFFFF', padding: '24px', border: '1px solid #E5E0D8', borderRadius: '6px', marginBottom: '48px' }}>
            {activeTab === 'description' && (
              <p style={{ lineHeight: '1.7', color: '#5C4A3A' }}>{product.description}</p>
            )}
            {activeTab === 'ingredients' && (
              <p style={{ lineHeight: '1.7', color: '#5C4A3A' }}>{product.ingredients || '100% Pure Natural Honey'}</p>
            )}
            {activeTab === 'storage' && (
              <div>
                <p style={{ fontWeight: 600, marginBottom: '8px' }}>Storage Instructions:</p>
                <p style={{ color: '#5C4A3A', marginBottom: '16px' }}>{product.storage_info}</p>
                <p style={{ fontWeight: 600, marginBottom: '8px' }}>Shipping Details:</p>
                <p style={{ color: '#5C4A3A' }}>{product.shipping_info}</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((r, i) => (
                    <div key={i} style={{ borderBottom: '1px solid #E5E0D8', paddingBottom: '16px', marginBottom: '16px' }}>
                      <div style={{ color: '#D4A24E', marginBottom: '4px' }}>★ {r.rating}/5</div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{r.title}</div>
                      <p style={{ color: '#5C4A3A', fontSize: '14px' }}>{r.comment}</p>
                      <div style={{ fontSize: '11px', color: '#8B7B6B', marginTop: '4px' }}>By {r.customer_name || 'Verified Customer'}</div>
                    </div>
                  ))
                ) : (
                  <p>No customer reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Honey Products */}
        {product.related && product.related.length > 0 && (
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>Related Honey Products</h3>
            <div className="grid grid-4">
              {product.related.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

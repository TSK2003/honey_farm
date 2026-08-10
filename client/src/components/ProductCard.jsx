import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const primaryVariant = product.variants && product.variants.length > 0
    ? product.variants[0]
    : { price: 0, mrp: 0, stock: 0, weight: '' };

  const primaryImage = product.images && product.images.length > 0
    ? product.images[0].url
    : '/images/product-natural-honey.png';

  const discountPercent = primaryVariant.mrp > primaryVariant.price
    ? Math.round(((primaryVariant.mrp - primaryVariant.price) / primaryVariant.mrp) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (primaryVariant.stock > 0) {
      addToCart(product, primaryVariant, 1);
      addToast(`Added ${product.name} (${primaryVariant.weight}) to cart`, 'success');
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-image">
        <img 
          src={primaryImage} 
          alt={product.name} 
          onError={(e) => { e.target.src = '/images/product-natural-honey.png'; }}
        />
        {discountPercent > 0 && (
          <span className="product-card-badge">{discountPercent}% OFF</span>
        )}
      </Link>

      <div className="product-card-body">
        <div className="product-card-weight">{primaryVariant.weight || '250g'}</div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>

        <div className="product-card-rating">
          <span className="stars">★ {product.rating || '5.0'}</span>
          <span className="count">({product.review_count || 3})</span>
        </div>

        <div className="product-card-price">
          <span className="price">₹{primaryVariant.price}</span>
          {primaryVariant.mrp > primaryVariant.price && (
            <span className="mrp">₹{primaryVariant.mrp}</span>
          )}
        </div>

        <div className="product-card-stock">
          {primaryVariant.stock > 10 ? (
            <span className="in-stock">In Stock</span>
          ) : primaryVariant.stock > 0 ? (
            <span className="low-stock">Only {primaryVariant.stock} left</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>

        <div className="product-card-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={primaryVariant.stock <= 0}
          >
            {primaryVariant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

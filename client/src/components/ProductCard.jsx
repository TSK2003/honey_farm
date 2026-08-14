import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { toggleWishlist, isInWishlist } from '../services/firebaseService';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [inWish, setInWish] = useState(false);

  useEffect(() => {
    if (product) {
      setInWish(isInWishlist(product.id));
    }
  }, [product]);

  if (!product) return null;

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

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggleWishlist(product);
    setInWish(res.inWishlist);
    addToast(res.inWishlist ? `Added ${product.name} to Wishlist` : `Removed ${product.name} from Wishlist`, 'info');
  };

  return (
    <div className="product-card" style={{ position: 'relative' }}>
      <button 
        type="button" 
        onClick={handleToggleWishlist}
        title={inWish ? "Remove from wishlist" : "Add to wishlist"}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 5,
          background: inWish ? '#C17817' : 'rgba(255, 255, 255, 0.9)',
          border: inWish ? 'none' : '1px solid #E5E0D8',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: inWish ? '#FFFFFF' : '#8B7B6B',
          transition: 'all 150ms ease',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}
      >
        <Heart size={16} fill={inWish ? "#FFFFFF" : "none"} />
      </button>

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

        <div className="product-card-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span className="stars" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Star size={13} fill="#D4A24E" color="#D4A24E" />
            <span>{product.rating || '5.0'}</span>
          </span>
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
            <span className="in-stock" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <Check size={12} /> In Stock
            </span>
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
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <ShoppingBag size={15} />
            <span>{primaryVariant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { getWishlist } from '../../services/firebaseService';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const data = await getWishlist();
        setItems(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();

    const handleUpdate = () => {
      fetchWishlist();
    };
    window.addEventListener('wishlist_updated', handleUpdate);
    return () => window.removeEventListener('wishlist_updated', handleUpdate);
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="wishlist-page section">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
          <h2>My Saved Honey Products</h2>
          <p>Quickly access and order the natural honey products you have marked as favorites.</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-state" style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', background: '#FFF8ED', color: '#C17817', marginBottom: '16px' }}>
              <Heart size={40} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#2C1810', marginBottom: '8px' }}>Your Wishlist is Empty</h3>
            <p style={{ color: '#5C4A3A', maxWidth: '380px', margin: '0 auto 24px' }}>Save your favorite natural honey products to easily order later.</p>
            <Link to="/shop" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} />
              <span>EXPLORE HONEY SHOP</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-4">
            {items.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

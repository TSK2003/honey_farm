import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const res = await fetch('/api/wishlist', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('khf_customer_token')}` }
        });
        const data = await res.json();
        if (data.items) setItems(data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="wishlist-page section">
      <div className="container">
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>My Saved Honey Products</h2>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">❤️</div>
            <h3>Your Wishlist is Empty</h3>
            <p>Save your favorite natural honey products to easily order later.</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: '16px' }}>Explore Honey Shop</Link>
          </div>
        ) : (
          <div className="grid grid-4">
            {items.map(item => (
              <ProductCard key={item.product_id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

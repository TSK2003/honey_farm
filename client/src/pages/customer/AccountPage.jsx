import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AccountPage() {
  const { customer, logoutCustomer } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="account-page section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>My Account</h2>

        <div className="grid grid-2" style={{ gap: '24px' }}>
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5E0D8' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Profile Information</h3>
            <p><strong>Name:</strong> {customer?.name}</p>
            <p><strong>Email:</strong> {customer?.email}</p>
            <p><strong>Phone:</strong> {customer?.phone || 'Not provided'}</p>
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => { logoutCustomer(); navigate('/'); }} className="btn btn-outline btn-sm">
                LOGOUT
              </button>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5E0D8' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/account/orders" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>🛍️ View My Orders</Link>
              <Link to="/account/wishlist" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>❤️ My Wishlist</Link>
              <Link to="/shop" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>🍯 Browse Honey Store</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

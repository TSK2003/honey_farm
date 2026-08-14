import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Heart, ShoppingBag, LogOut, User, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AccountPage() {
  const { customer, logoutCustomer } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutCustomer();
    addToast('Logged out successfully', 'info');
    navigate('/');
  };

  return (
    <div className="account-page section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>My Account</h2>

        <div className="grid grid-2" style={{ gap: '24px' }}>
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5E0D8' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="#C17817" />
              <span>Profile Information</span>
            </h3>
            <p style={{ marginBottom: '8px' }}><strong>Name:</strong> {customer?.name}</p>
            <p style={{ marginBottom: '8px' }}><strong>Email:</strong> {customer?.email}</p>
            <p style={{ marginBottom: '16px' }}><strong>Phone:</strong> {customer?.phone || 'Not provided'}</p>
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={15} />
                <span>LOGOUT</span>
              </button>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5E0D8' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Quick Navigation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/account/orders" className="btn btn-ghost" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={18} color="#C17817" />
                <span>View My Orders & Tracking</span>
              </Link>
              <Link to="/account/wishlist" className="btn btn-ghost" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Heart size={18} color="#C17817" />
                <span>My Saved Wishlist</span>
              </Link>
              <Link to="/shop" className="btn btn-ghost" style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingBag size={18} color="#C17817" />
                <span>Browse Natural Honey Store</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

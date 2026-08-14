import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { registerCustomerFirebase } from '../../services/firebaseService';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { loginCustomer } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerCustomerFirebase(formData);
      loginCustomer(data.customer, data.token);
      addToast('Account created successfully at Honey Bee Farm!', 'success');
      navigate('/account');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page section">
      <div className="container" style={{ maxWidth: '440px' }}>
        <div style={{ background: '#FFFFFF', padding: '36px', borderRadius: '12px', border: '1px solid #E8DFD3', boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', marginBottom: '8px', color: '#2C1810' }}>Create Customer Account</h2>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#5C4A3A', marginBottom: '24px' }}>Join Honey Bee Farm for easy ordering & live order tracking</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} />
                <span>Full Name *</span>
              </label>
              <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Ramesh Kumar" />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} />
                <span>Email Address *</span>
              </label>
              <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="your.email@example.com" />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} />
                <span>Mobile Phone</span>
              </label>
              <input type="text" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="10-digit mobile number" />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} />
                <span>Password *</span>
              </label>
              <input type="password" className="form-input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required placeholder="••••••••" />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }} 
              disabled={loading}
            >
              <span>{loading ? 'Creating Account...' : 'REGISTER ACCOUNT'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#5C4A3A', borderTop: '1px solid #E8DFD3', paddingTop: '16px' }}>
            Already registered? <Link to="/login" style={{ color: '#C17817', fontWeight: 600 }}>Login Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

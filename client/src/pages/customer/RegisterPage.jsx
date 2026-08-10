import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      addToast('Account created successfully!', 'success');
      navigate('/account');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page section">
      <div className="container" style={{ maxWidth: '400px' }}>
        <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5E0D8' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '24px' }}>Create Customer Account</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Phone</label>
              <input type="text" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" className="form-input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'REGISTER'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#5C4A3A' }}>
            Already registered? <Link to="/login" style={{ color: '#C17817', fontWeight: 600 }}>Login Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

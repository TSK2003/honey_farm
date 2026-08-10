import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@kamalahoney.com');
  const [password, setPassword] = useState('KamalaAdmin@2026');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      loginAdmin(data.admin, data.token);
      addToast('Welcome back, Admin', 'success');
      navigate('/admin');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#2C1810', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlignment: 'center', marginBottom: '24px', textAlign: 'center' }}>
          <img src="/images/logo.png" alt="Kamala Honey Farm" style={{ height: '60px', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2C1810' }}>Admin Portal Login</h2>
          <p style={{ fontSize: '12px', color: '#8B7B6B' }}>Kamala Honey Farm Management</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', padding: '12px' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'LOG IN TO ADMIN PANEL'}
          </button>
        </form>
      </div>
    </div>
  );
}

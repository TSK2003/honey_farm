import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { loginAdminFirebase } from '../../services/firebaseService';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@honeybeefarm.com');
  const [password, setPassword] = useState('HoneyBeeAdmin@2026');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginAdminFirebase({ email, password });
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
      <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '420px', boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/images/logo.png" alt="Honey Bee Farm" style={{ height: '58px', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#2C1810' }}>Admin Portal Login</h2>
          <p style={{ fontSize: '12px', color: '#8B7B6B', marginTop: '4px' }}>Honey Bee Farm Management Portal</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} />
              <span>Admin Email</span>
            </label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} />
              <span>Password</span>
            </label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '16px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} 
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'LOG IN TO ADMIN PANEL'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #E8DFD3', paddingTop: '16px' }}>
          <Link to="/" style={{ fontSize: '13px', color: '#C17817', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { loginCustomerFirebase } from '../../services/firebaseService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginCustomer } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginCustomerFirebase({ email, password });
      loginCustomer(data.customer, data.token);
      addToast('Logged in successfully', 'success');
      navigate(redirect);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page section">
      <div className="container" style={{ maxWidth: '420px' }}>
        <div style={{ background: '#FFFFFF', padding: '36px', borderRadius: '8px', border: '1px solid #E5E0D8', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', marginBottom: '8px', color: '#2C1810' }}>Customer Login</h2>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#5C4A3A', marginBottom: '24px' }}>Access your orders, saved wishlist, and profile</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} />
                <span>Email Address</span>
              </label>
              <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your.email@example.com" />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={14} />
                <span>Password</span>
              </label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }} 
              disabled={loading}
            >
              <span>{loading ? 'Logging in...' : 'LOGIN TO ACCOUNT'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#5C4A3A', borderTop: '1px solid #E5E0D8', paddingTop: '16px' }}>
            Don't have an account? <Link to="/register" style={{ color: '#C17817', fontWeight: 600 }}>Create an Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

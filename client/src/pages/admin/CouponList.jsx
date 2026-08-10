import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CouponList() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percentage', value: 10, min_order: 500 });

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      const res = await fetch('/api/coupons', {
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify(newCoupon)
      });
      if (res.ok) {
        addToast('Coupon created', 'success');
        setNewCoupon({ code: '', type: 'percentage', value: 10, min_order: 500 });
        fetchCoupons();
      }
    } catch (err) {
      addToast('Error creating coupon', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      addToast('Coupon deleted', 'success');
      fetchCoupons();
    } catch (err) {
      addToast('Error deleting coupon', 'error');
    }
  };

  return (
    <AdminLayout title="Coupon & Promo Management">
      <div className="grid grid-2" style={{ gap: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Create Coupon</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Coupon Code *</label>
              <input type="text" className="form-input" value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} placeholder="e.g. HONEY10" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-select" value={newCoupon.type} onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Value *</label>
                <input type="number" className="form-input" value={newCoupon.value} onChange={(e) => setNewCoupon({...newCoupon, value: parseFloat(e.target.value)})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Minimum Order Amount (₹)</label>
              <input type="number" className="form-input" value={newCoupon.min_order} onChange={(e) => setNewCoupon({...newCoupon, min_order: parseFloat(e.target.value)})} />
            </div>
            <button type="submit" className="btn btn-primary">CREATE COUPON</button>
          </form>
        </div>

        <div className="table-container" style={{ background: 'white' }}>
          <table className="table">
            <thead>
              <tr><th>Code</th><th>Discount</th><th>Min Order</th><th>Used</th><th>Action</th></tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700, color: '#C17817' }}>{c.code}</td>
                  <td>{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td>₹{c.min_order}</td>
                  <td>{c.used_count || 0} times</td>
                  <td><button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-danger">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

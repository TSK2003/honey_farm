import React, { useEffect, useState } from 'react';
import { Ticket, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getCoupons, saveCoupon, deleteCoupon } from '../../services/firebaseService';

export default function CouponList() {
  const { addToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({ code: '', type: 'percentage', value: 10, min_order: 500 });

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const data = await getCoupons();
      if (Array.isArray(data)) setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    try {
      await saveCoupon(newCoupon);
      addToast('Discount coupon created successfully in Firestore!', 'success');
      setNewCoupon({ code: '', type: 'percentage', value: 10, min_order: 500 });
      fetchCoupons();
    } catch (err) {
      addToast('Error creating coupon: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCoupon(id);
      addToast('Coupon deleted from Firestore', 'success');
      fetchCoupons();
    } catch (err) {
      addToast('Error deleting coupon', 'error');
    }
  };

  return (
    <AdminLayout title="Discount Coupons Management">
      <div className="grid grid-2" style={{ gap: '32px' }}>
        {/* Create form */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} color="#C17817" />
            <span>Create New Discount Coupon</span>
          </h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Coupon Code *</label>
              <input
                type="text"
                className="form-input"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                placeholder="e.g. HONEY10"
                required
              />
            </div>

            <div className="grid grid-2" style={{ gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Discount Type</label>
                <select
                  className="form-input"
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Value</label>
                <input
                  type="number"
                  className="form-input"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Order Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                value={newCoupon.min_order}
                onChange={(e) => setNewCoupon({ ...newCoupon, min_order: Number(e.target.value) })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Plus size={16} />
              <span>CREATE COUPON</span>
            </button>
          </form>
        </div>

        {/* List */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Ticket size={18} color="#C17817" />
            <span>Active Coupons ({coupons.length})</span>
          </h3>

          {loading ? (
            <div className="loader"><div className="spinner"></div></div>
          ) : coupons.length === 0 ? (
            <p style={{ color: '#8B7B6B', fontSize: '13px' }}>No coupons created yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Coupon Code</th>
                  <th>Discount</th>
                  <th>Min Order</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, color: '#C17817' }}>{c.code}</td>
                    <td>{c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}</td>
                    <td>₹{c.min_order}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#C44B3F', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '12px' }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

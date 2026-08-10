import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ReviewList() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch('/api/reviews/admin/all', {
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/reviews/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        addToast(`Review ${status}`, 'success');
        fetchReviews();
      }
    } catch (err) {
      addToast('Error updating review', 'error');
    }
  };

  return (
    <AdminLayout title="Review Moderation">
      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <div className="table-container" style={{ background: 'white' }}>
          <table className="table">
            <thead>
              <tr><th>Product</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.product_name}</td>
                  <td>{r.customer_name}</td>
                  <td style={{ color: '#D4A24E' }}>★ {r.rating}/5</td>
                  <td style={{ fontSize: '13px' }}>"{r.comment}"</td>
                  <td>
                    <span className={`badge badge-${r.status === 'approved' ? 'success' : r.status === 'pending' ? 'warning' : 'danger'}`}>
                      {r.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {r.status !== 'approved' && <button onClick={() => handleUpdateStatus(r.id, 'approved')} className="btn btn-sm btn-primary">Approve</button>}
                      {r.status !== 'hidden' && <button onClick={() => handleUpdateStatus(r.id, 'hidden')} className="btn btn-sm btn-ghost">Hide</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

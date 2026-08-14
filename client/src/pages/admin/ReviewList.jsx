import React, { useEffect, useState } from 'react';
import { Star, Check, EyeOff } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getAllAdminReviews, updateReviewStatus } from '../../services/firebaseService';

export default function ReviewList() {
  const { addToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const data = await getAllAdminReviews();
      if (Array.isArray(data)) setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateReviewStatus(id, status);
      addToast(`Review marked as ${status} in Firestore`, 'success');
      fetchReviews();
    } catch (err) {
      addToast('Error updating review status', 'error');
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
              <tr><th>Honey Product</th><th>Customer</th><th>Rating</th><th>Review Comment</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.product_name || 'Pure Natural Honey'}</td>
                  <td>{r.customer_name}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#D4A24E' }}>
                      <Star size={13} fill="#D4A24E" color="#D4A24E" />
                      <span>{r.rating}/5</span>
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', maxWidth: '300px' }}>"{r.comment}"</td>
                  <td>
                    <span className={`badge badge-${r.status === 'approved' ? 'success' : r.status === 'pending' ? 'warning' : 'danger'}`}>
                      {r.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {r.status !== 'approved' && (
                        <button 
                          onClick={() => handleUpdateStatus(r.id, 'approved')} 
                          className="btn btn-sm btn-primary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Check size={12} />
                          <span>Approve</span>
                        </button>
                      )}
                      {r.status !== 'hidden' && (
                        <button 
                          onClick={() => handleUpdateStatus(r.id, 'hidden')} 
                          className="btn btn-sm btn-outline"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <EyeOff size={12} />
                          <span>Hide</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#8B7B6B' }}>No customer reviews found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

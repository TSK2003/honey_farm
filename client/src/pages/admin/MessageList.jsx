import React, { useEffect, useState } from 'react';
import { Mail, Check, Clock } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getAdminMessages, updateMessageStatus } from '../../services/firebaseService';

export default function MessageList() {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const data = await getAdminMessages();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateMessageStatus(id, status);
      addToast('Message marked as resolved in Firestore', 'success');
      fetchMessages();
    } catch (err) {
      addToast('Error updating status', 'error');
    }
  };

  return (
    <AdminLayout title="Customer Inquiries & Messages">
      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <div className="table-container" style={{ background: 'white' }}>
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Name</th><th>Contact</th><th>Subject</th><th>Message Content</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id}>
                  <td style={{ fontSize: '12px', color: '#8B7B6B' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td>
                    <div style={{ fontSize: '13px' }}>{m.phone || 'No phone'}</div>
                    <div style={{ fontSize: '11px', color: '#8B7B6B' }}>{m.email}</div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{m.subject || 'General Inquiry'}</td>
                  <td style={{ fontSize: '13px', maxWidth: '300px', lineHeight: '1.4' }}>{m.message}</td>
                  <td>
                    <span className={`badge badge-${m.status === 'resolved' ? 'success' : 'warning'}`}>
                      {m.status?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {m.status !== 'resolved' && (
                      <button 
                        onClick={() => handleUpdateStatus(m.id, 'resolved')} 
                        className="btn btn-sm btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Check size={12} />
                        <span>Resolve</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#8B7B6B' }}>No contact inquiries received</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

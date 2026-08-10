import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function MessageList() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch('/api/messages', {
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify({ status })
      });
      addToast('Message status updated', 'success');
      fetchMessages();
    } catch (err) {
      addToast('Error updating status', 'error');
    }
  };

  return (
    <AdminLayout title="Customer Messages">
      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <div className="table-container" style={{ background: 'white' }}>
          <table className="table">
            <thead>
              <tr><th>Date</th><th>Name</th><th>Contact</th><th>Subject</th><th>Message</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id}>
                  <td style={{ fontSize: '12px', color: '#8B7B6B' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td>{m.phone || m.email}</td>
                  <td>{m.subject || 'Inquiry'}</td>
                  <td style={{ fontSize: '13px', maxWidth: '300px' }}>{m.message}</td>
                  <td><span className={`badge badge-${m.status === 'resolved' ? 'success' : 'warning'}`}>{m.status}</span></td>
                  <td>
                    {m.status !== 'resolved' && (
                      <button onClick={() => handleUpdateStatus(m.id, 'resolved')} className="btn btn-sm btn-primary">Mark Resolved</button>
                    )}
                  </td>
                </tr>
              ))}
              {messages.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center' }}>No messages submitted</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

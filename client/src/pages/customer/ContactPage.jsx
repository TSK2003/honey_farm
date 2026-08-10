import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function ContactPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      addToast('Name and message are required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        addToast('Message sent successfully!', 'success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        addToast('Failed to send message', 'error');
      }
    } catch (err) {
      addToast('Error sending message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">GET IN TOUCH</span>
          <h2>Contact Kamala Honey Farm</h2>
          <p>We'd love to hear from you. Contact us for bulk orders or farm visits.</p>
        </div>

        <div className="grid grid-2" style={{ gap: '40px' }}>
          {/* Contact Details */}
          <div style={{ background: '#FFF8ED', padding: '32px', borderRadius: '8px', border: '1px solid #F0D48A' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Farm Contact Info</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#C17817', fontWeight: 700 }}>LOCATION</div>
              <div style={{ fontSize: '15px', fontWeight: 500 }}>Kamala Honey Farm, Tirunelveli, Tamil Nadu, India</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#C17817', fontWeight: 700 }}>PHONE / WHATSAPP</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>+91 7708510872</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#C17817', fontWeight: 700 }}>INSTAGRAM</div>
              <a 
                href="https://www.instagram.com/kamala_honey_farm_tirunelveli" 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '14px', color: '#2C1810', fontWeight: 600, textDecoration: 'underline' }}
              >
                @kamala_honey_farm_tirunelveli
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} style={{ background: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5E0D8' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Send Us a Message</h3>

            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea className="form-textarea" rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required></textarea>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'SEND MESSAGE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { InstagramIcon } from '../../components/Icons';
import { useToast } from '../../context/ToastContext';
import { submitContactMessage } from '../../services/firebaseService';

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
      await submitContactMessage(formData);
      addToast('Your message has been sent to Honey Bee Farm!', 'success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      addToast('Error sending message: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">GET IN TOUCH</span>
          <h2>Contact Honey Bee Farm</h2>
          <p>We'd love to hear from you. Contact our apiary team for inquiries, bulk orders, or wellness gifting.</p>
        </div>

        <div className="grid grid-2" style={{ gap: '40px' }}>
          {/* Contact Details */}
          <div style={{ background: '#FFF8ED', padding: '32px', borderRadius: '12px', border: '1px solid #F0D48A' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#2C1810' }}>Apiary Contact Info</h3>
            
            <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', background: '#FFFFFF', borderRadius: '8px', color: '#C17817', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#C17817', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#2C1810', marginTop: '2px' }}>
                  Honey Bee Farm Apiaries, Tirunelveli, Tamil Nadu, India
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', background: '#FFFFFF', borderRadius: '8px', color: '#C17817', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#C17817', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone / WhatsApp</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#2C1810', marginTop: '2px' }}>
                  +91 7708510872
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ padding: '10px', background: '#FFFFFF', borderRadius: '8px', color: '#C17817', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <InstagramIcon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#C17817', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Instagram</div>
                <a 
                  href="https://www.instagram.com/honey_bee_farm_tirunelveli" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: '15px', color: '#C17817', fontWeight: 600, textDecoration: 'underline', marginTop: '2px', display: 'inline-block' }}
                >
                  @honey_bee_farm_tirunelveli
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} style={{ background: '#FFFFFF', padding: '32px', borderRadius: '12px', border: '1px solid #E8DFD3', boxShadow: '0 4px 16px rgba(44, 24, 16, 0.04)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Send Us a Message</h3>

            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Ramesh Kumar" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="10-digit mobile" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@example.com" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" className="form-input" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="e.g. Bulk order inquiry" />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea className="form-textarea" rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required placeholder="Write your message here..."></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submitting}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px' }}
            >
              <Send size={16} />
              <span>{submitting ? 'Sending...' : 'SEND MESSAGE'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

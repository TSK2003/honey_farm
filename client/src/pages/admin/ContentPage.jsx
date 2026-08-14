import React, { useEffect, useState } from 'react';
import { FileText, Save } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getWebsiteContent, saveWebsiteContent } from '../../services/firebaseService';

export default function ContentPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState({
    hero: {
      title: 'Pure Honey. Naturally Harvested.',
      description: 'Discover naturally sourced honey from Honey Bee Farm, Tirunelveli. Raw, unprocessed, and delivered direct from our farm to your home.',
      cta_text: 'SHOP HONEY'
    },
    why_choose_1: {
      title: 'Natural Honey Focus',
      description: 'We specialize exclusively in natural honey, ensuring every bottle meets strict standards of purity and taste.'
    },
    why_choose_2: {
      title: 'Careful Harvesting',
      description: 'Our honey is harvested using traditional methods that protect both bee colonies and natural enzymes.'
    },
    final_cta: {
      title: 'Bring the Goodness of Natural Honey Home',
      description: 'Order 100% natural, raw honey harvested directly from Honey Bee Farm in Tirunelveli.',
      cta_text: 'SHOP HONEY NOW'
    }
  });

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const data = await getWebsiteContent();
      if (data) {
        setContent(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveAll = async (e) => {
    e.preventDefault();
    try {
      await saveWebsiteContent(content);
      addToast('All website content saved to Firestore successfully!', 'success');
    } catch (err) {
      addToast('Error saving website content', 'error');
    }
  };

  if (loading) return <AdminLayout title="Website Content Management"><div className="loader"><div className="spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Website Content Management">
      <form onSubmit={handleSaveAll} style={{ maxWidth: '800px' }}>
        {/* Hero Section Editor */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', marginBottom: '24px', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid #E8DFD3', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={18} color="#C17817" />
            <span>1. Hero Section Content</span>
          </h3>
          <div className="form-group">
            <label className="form-label">Hero Heading Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={content.hero?.title || ''} 
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Hero Supporting Subtext</label>
            <textarea 
              className="form-textarea" 
              rows="3" 
              value={content.hero?.description || ''} 
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })} 
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Hero CTA Button Text</label>
            <input 
              type="text" 
              className="form-input" 
              value={content.hero?.cta_text || ''} 
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, cta_text: e.target.value } })} 
              required 
            />
          </div>
        </div>

        {/* Why Choose Section Editor */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', marginBottom: '24px', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid #E8DFD3', paddingBottom: '8px' }}>
            2. "Why Choose Honey Bee Farm" Content
          </h3>
          <div className="form-group">
            <label className="form-label">Key Highlight Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={content.why_choose_1?.title || ''} 
              onChange={(e) => setContent({ ...content, why_choose_1: { ...content.why_choose_1, title: e.target.value } })} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Key Highlight Description</label>
            <textarea 
              className="form-textarea" 
              rows="2" 
              value={content.why_choose_1?.description || ''} 
              onChange={(e) => setContent({ ...content, why_choose_1: { ...content.why_choose_1, description: e.target.value } })}
            ></textarea>
          </div>
        </div>

        {/* Final CTA Section Editor */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', marginBottom: '24px', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid #E8DFD3', paddingBottom: '8px' }}>
            3. Final Call-to-Action Banner Content
          </h3>
          <div className="form-group">
            <label className="form-label">Final CTA Title</label>
            <input 
              type="text" 
              className="form-input" 
              value={content.final_cta?.title || ''} 
              onChange={(e) => setContent({ ...content, final_cta: { ...content.final_cta, title: e.target.value } })} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Final CTA Button Text</label>
            <input 
              type="text" 
              className="form-input" 
              value={content.final_cta?.cta_text || ''} 
              onChange={(e) => setContent({ ...content, final_cta: { ...content.final_cta, cta_text: e.target.value } })} 
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} />
          <span>SAVE WEBSITE CONTENT</span>
        </button>
      </form>
    </AdminLayout>
  );
}

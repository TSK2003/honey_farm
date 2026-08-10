import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ContentPage() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState({
    hero_title: 'Pure Honey. Naturally Harvested.',
    hero_subtext: 'Discover naturally sourced honey from Kamala Honey Farm, Tirunelveli.',
    hero_cta: 'SHOP HONEY',
    why_1_title: 'Natural Honey Focus',
    why_1_desc: 'We specialize exclusively in natural honey, ensuring every bottle meets strict standards of purity and taste.',
    why_2_title: 'Careful Harvesting',
    why_2_desc: 'Our honey is harvested using traditional methods that protect both bee colonies and natural enzymes.',
    why_3_title: 'Quality Focus',
    why_3_desc: 'Every batch undergoes rigorous quality checks to deliver authentic raw honey to your table.',
    why_4_title: 'Tirunelveli Origin',
    why_4_desc: 'Nurtured in the biodiverse flora of Tirunelveli, Tamil Nadu, for a rich, distinctive flavor profile.',
    final_cta_title: 'Bring the Goodness of Natural Honey Home',
    final_cta_btn: 'SHOP HONEY NOW'
  });

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data) {
        setContent(prev => ({
          ...prev,
          hero_title: data.hero?.title || prev.hero_title,
          hero_subtext: data.hero?.description || prev.hero_subtext,
          hero_cta: data.hero?.cta_text || prev.hero_cta,
          why_1_title: data.why_choose_1?.title || prev.why_1_title,
          why_1_desc: data.why_choose_1?.description || prev.why_1_desc,
          final_cta_title: data.final_cta?.title || prev.final_cta_title,
          final_cta_btn: data.final_cta?.cta_text || prev.final_cta_btn
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveKey = async (key, title, description, cta_text) => {
    try {
      const res = await fetch(`/api/content/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify({ title, description, cta_text })
      });
      if (res.ok) {
        addToast(`Section "${key}" updated successfully`, 'success');
      }
    } catch (err) {
      addToast('Error saving content', 'error');
    }
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    await handleSaveKey('hero', content.hero_title, content.hero_subtext, content.hero_cta);
    await handleSaveKey('why_choose_1', content.why_1_title, content.why_1_desc, null);
    await handleSaveKey('final_cta', content.final_cta_title, null, content.final_cta_btn);
    addToast('All website content saved to database', 'success');
  };

  if (loading) return <AdminLayout title="Website Content Management"><div className="loader"><div className="spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Website Content Management">
      <form onSubmit={handleSaveAll} style={{ maxWidth: '800px' }}>
        {/* Hero Section Editor */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid #E5E0D8', paddingBottom: '8px' }}>
            1. Hero Section Content
          </h3>
          <div className="form-group">
            <label className="form-label">Hero Heading Title</label>
            <input type="text" className="form-input" value={content.hero_title} onChange={(e) => setContent({...content, hero_title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="form-label">Hero Supporting Subtext</label>
            <textarea className="form-textarea" rows="3" value={content.hero_subtext} onChange={(e) => setContent({...content, hero_subtext: e.target.value})} required></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Hero CTA Button Text</label>
            <input type="text" className="form-input" value={content.hero_cta} onChange={(e) => setContent({...content, hero_cta: e.target.value})} required />
          </div>
        </div>

        {/* Why Choose Section Editor */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid #E5E0D8', paddingBottom: '8px' }}>
            2. "Why Choose Kamala" Content
          </h3>
          <div className="form-group">
            <label className="form-label">Point 1 Title</label>
            <input type="text" className="form-input" value={content.why_1_title} onChange={(e) => setContent({...content, why_1_title: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Point 1 Description</label>
            <textarea className="form-textarea" rows="2" value={content.why_1_desc} onChange={(e) => setContent({...content, why_1_desc: e.target.value})}></textarea>
          </div>
        </div>

        {/* Final CTA Section Editor */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid #E5E0D8', paddingBottom: '8px' }}>
            3. Final CTA Banner Content
          </h3>
          <div className="form-group">
            <label className="form-label">Final CTA Title</label>
            <input type="text" className="form-input" value={content.final_cta_title} onChange={(e) => setContent({...content, final_cta_title: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Final CTA Button Text</label>
            <input type="text" className="form-input" value={content.final_cta_btn} onChange={(e) => setContent({...content, final_cta_btn: e.target.value})} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg">
          SAVE ALL WEBSITE CONTENT
        </button>
      </form>
    </AdminLayout>
  );
}

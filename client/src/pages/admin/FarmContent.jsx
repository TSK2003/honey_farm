import React, { useState, useEffect } from 'react';
import { Sparkles, Save } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getWebsiteContent, saveWebsiteContent } from '../../services/firebaseService';

export default function FarmContent() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [farmStory, setFarmStory] = useState({
    title: 'From Our Apiaries to Your Table',
    tagline: 'Sustainable beekeeping and ethical raw honey extraction in Tirunelveli',
    process1: 'Beekeeping: Healthy bee boxes maintained in natural flora surroundings.',
    process2: 'Harvesting: Collected only when honeycombs are fully ripe and capped.',
    process3: 'Filtering: Gentle gravity filtration to retain pollen and vitamins.',
    process4: 'Packaging: Pure raw honey sealed in food-grade jars.'
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getWebsiteContent();
        if (data?.farm_story) {
          setFarmStory(prev => ({ ...prev, ...data.farm_story }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await saveWebsiteContent({ farm_story: farmStory }, 'farm');
      addToast('Farm story and beekeeping workflow saved to Firestore!', 'success');
    } catch (err) {
      addToast('Error saving farm story', 'error');
    }
  };

  return (
    <AdminLayout title="Farm Story Content">
      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <form onSubmit={handleSave} style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', maxWidth: '650px', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={18} color="#C17817" />
            <span>Beekeeping & Apiary Story Workflow</span>
          </h3>

          <div className="form-group">
            <label className="form-label">Story Heading</label>
            <input 
              type="text" 
              className="form-input" 
              value={farmStory.title} 
              onChange={(e) => setFarmStory({ ...farmStory, title: e.target.value })} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Story Tagline / Summary</label>
            <textarea 
              className="form-textarea" 
              rows="2" 
              value={farmStory.tagline} 
              onChange={(e) => setFarmStory({ ...farmStory, tagline: e.target.value })} 
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Step 1 (Beekeeping)</label>
            <input type="text" className="form-input" value={farmStory.process1} onChange={(e) => setFarmStory({ ...farmStory, process1: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Step 2 (Harvesting)</label>
            <input type="text" className="form-input" value={farmStory.process2} onChange={(e) => setFarmStory({ ...farmStory, process2: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Step 3 (Processing)</label>
            <input type="text" className="form-input" value={farmStory.process3} onChange={(e) => setFarmStory({ ...farmStory, process3: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Step 4 (Packaging)</label>
            <input type="text" className="form-input" value={farmStory.process4} onChange={(e) => setFarmStory({ ...farmStory, process4: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Save size={16} />
            <span>SAVE APIARY STORY</span>
          </button>
        </form>
      )}
    </AdminLayout>
  );
}


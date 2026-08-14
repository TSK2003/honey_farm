import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function FarmPage() {
  return (
    <div className="farm-page">
      <style>{`
        .farm-hero {
          background: linear-gradient(rgba(44, 24, 16, 0.8), rgba(44, 24, 16, 0.8)), url('/images/farm-beekeeping.png');
          background-size: cover;
          background-position: center;
          color: white;
          padding: 80px 0;
          text-align: center;
        }
      `}</style>
      <div className="farm-hero">
        <div className="container">
          <span className="section-label" style={{ color: '#D4A24E', background: 'rgba(212, 162, 78, 0.2)' }}>OUR APIARIES</span>
          <h1 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', color: '#FFFFFF' }}>Our Farm & Beekeeping</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: '#E8DFD3' }}>
            Discover how Honey Bee Farm harvests 100% natural, raw honey with sustainable beekeeping practices in Tirunelveli.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '48px', marginBottom: '60px' }}>
          <div>
            <span className="section-label">THE LOCATION</span>
            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Tirunelveli Floral Apiaries</h2>
            <p style={{ color: '#5C4A3A', lineHeight: '1.7', marginBottom: '16px' }}>
              Located in the biodiverse rural flora of Tirunelveli, Tamil Nadu, Honey Bee Farm apiaries provide an ideal natural habitat for honeybees. Surrounded by blooming neem, wildflower, and multi-floral plants, our bees forage freely on rich nectar.
            </p>
            <p style={{ color: '#5C4A3A', lineHeight: '1.7' }}>
              We practice bee-friendly harvesting, leaving ample honey in each hive for the colony's natural nourishment.
            </p>
          </div>
          <div>
            <img src="/images/farm-beekeeping.png" alt="Honey Bee Farm Apiaries" style={{ borderRadius: '12px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', width: '100%' }} />
          </div>
        </div>

        <div className="section-header">
          <span className="section-label">HARVESTING PHASES</span>
          <h2>The 4 Stages of Apiary Honey</h2>
        </div>

        <div className="grid grid-4">
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#C17817', marginBottom: '10px' }}>01</div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Hive Maintenance</h4>
            <p style={{ fontSize: '13px', color: '#5C4A3A' }}>Boxes positioned in natural floral surroundings with zero pesticide exposure.</p>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#C17817', marginBottom: '10px' }}>02</div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Comb Extraction</h4>
            <p style={{ fontSize: '13px', color: '#5C4A3A' }}>Combs collected only when fully capped and cured by the bees.</p>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#C17817', marginBottom: '10px' }}>03</div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Gravity Filter</h4>
            <p style={{ fontSize: '13px', color: '#5C4A3A' }}>Gentle straining without heat pasteurization to preserve live enzymes.</p>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#C17817', marginBottom: '10px' }}>04</div>
            <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Glass Packaging</h4>
            <p style={{ fontSize: '13px', color: '#5C4A3A' }}>Hermetically sealed in premium glass jars for door-to-door delivery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function FarmPage() {
  return (
    <div className="farm-page">
      <div className="section section-bg" style={{ textAlign: 'center' }}>
        <div className="container">
          <span className="section-label">TIRUNELVELI, TAMIL NADU</span>
          <h1 style={{ fontSize: '38px', fontWeight: 700, marginBottom: '16px' }}>Our Beekeeping Farm</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: '#5C4A3A' }}>
            Take a closer look at our sustainable beekeeping practices and natural honey harvesting process.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="grid grid-2" style={{ gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
          <div>
            <span className="section-label">BEEKEEPING</span>
            <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Healthy Hives & Happy Bees</h2>
            <p style={{ color: '#5C4A3A', lineHeight: '1.7' }}>
              Our bee boxes are strategically placed in rich, biodiverse environments across Tirunelveli. Our trained beekeepers maintain optimal hive hygiene without using harsh chemicals, ensuring our bees thrive in their natural habitat.
            </p>
          </div>
          <div>
            <img src="/images/farm-beekeeping.png" alt="Beekeeping" style={{ borderRadius: '8px' }} />
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: '40px', alignItems: 'center' }}>
          <div>
            <img src="/images/honey-harvesting.png" alt="Honey Harvesting" style={{ borderRadius: '8px' }} />
          </div>
          <div>
            <span className="section-label">HARVESTING</span>
            <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Ethical Extraction</h2>
            <p style={{ color: '#5C4A3A', lineHeight: '1.7' }}>
              We harvest honey only when honeycombs are fully capped by the bees, guaranteeing ideal moisture content and full maturation of vitamins and natural sugars.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

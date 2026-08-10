import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { getProducts, getCategories } from '../../services/firebaseService';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prods, cats] = await Promise.all([
          getProducts(),
          getCategories()
        ]);

        if (prods && prods.length > 0) {
          setFeaturedProducts(prods.filter(p => p.is_featured));
          setBestSellers(prods.filter(p => p.is_best_seller));
        }
        if (cats && cats.length > 0) {
          setCategories(cats);
        }

        setReviews([
          { id: 1, name: 'Senthil Kumar', location: 'Tirunelveli', rating: 5, comment: 'The purest honey I have tasted. Authentic farm taste direct from Tirunelveli. Highly recommended!' },
          { id: 2, name: 'Priya Ramesh', location: 'Chennai', rating: 5, comment: 'Natural Honey Comb is amazing! You can feel the freshness in every spoonful. Exceptional quality.' },
          { id: 3, name: 'Anand V.', location: 'Madurai', rating: 5, comment: 'Fast delivery and premium packaging. The raw honey flavor is distinct and delicious.' }
        ]);
      } catch (err) {
        console.error('Error fetching homepage data from Firebase:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="homepage">
      <style>{`
        /* Hero Section */
        .hero-section {
          background: linear-gradient(135deg, #FFF8ED 0%, #FBF8F3 100%);
          padding: 60px 0 80px;
          border-bottom: 1px solid #E5E0D8;
          position: relative;
          overflow: hidden;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }
        .hero-label {
          font-size: 13px;
          font-weight: 700;
          color: #C17817;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .hero-heading {
          font-size: 52px;
          font-weight: 700;
          color: #2C1810;
          line-height: 1.15;
          margin-bottom: 20px;
        }
        .hero-subtext {
          font-size: 16px;
          color: #5C4A3A;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 480px;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .hero-visual-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
        }
        .hero-visual-img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 12px 32px rgba(44, 24, 16, 0.12);
        }

        /* Trust / USP Strip */
        .usp-strip {
          background: #2C1810;
          color: #FFFFFF;
          padding: 24px 0;
        }
        .usp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .usp-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .usp-icon {
          width: 42px;
          height: 42px;
          border-radius: 6px;
          background: rgba(193, 120, 23, 0.2);
          color: #D4A24E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .usp-title {
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
        }
        .usp-subtitle {
          font-size: 12px;
          color: #A69686;
        }

        /* Collections */
        .collection-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }
        .collection-card {
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          border-radius: 6px;
          padding: 16px;
          text-align: center;
          transition: all 200ms ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .collection-card:hover {
          border-color: #C17817;
          box-shadow: 0 4px 12px rgba(193, 120, 23, 0.1);
        }
        .collection-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 12px;
        }
        .collection-title {
          font-size: 14px;
          font-weight: 600;
          color: #2C1810;
        }

        /* Why Choose */
        .why-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .why-card {
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          border-radius: 6px;
          padding: 24px;
        }
        .why-num {
          font-size: 24px;
          font-weight: 700;
          color: #C17817;
          margin-bottom: 12px;
        }
        .why-title {
          font-size: 16px;
          font-weight: 600;
          color: #2C1810;
          margin-bottom: 8px;
        }
        .why-desc {
          font-size: 13px;
          color: #5C4A3A;
          line-height: 1.5;
        }

        /* Farm Story */
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }
        .story-img {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        /* Process Steps */
        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .process-card {
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          border-radius: 6px;
          overflow: hidden;
        }
        .process-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
        }
        .process-body {
          padding: 16px;
        }
        .process-step {
          font-size: 12px;
          font-weight: 700;
          color: #C17817;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .process-title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .process-desc {
          font-size: 12px;
          color: #5C4A3A;
          line-height: 1.4;
        }

        /* Gallery Showcase */
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .showcase-item {
          aspect-ratio: 1;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }
        .showcase-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 200ms ease;
        }
        .showcase-item:hover img {
          transform: scale(1.03);
        }

        /* Reviews */
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .review-card {
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          border-radius: 6px;
          padding: 24px;
        }
        .review-stars {
          color: #D4A24E;
          margin-bottom: 12px;
        }
        .review-comment {
          font-size: 14px;
          color: #2C1810;
          font-style: italic;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .review-author {
          font-size: 13px;
          font-weight: 600;
          color: #2C1810;
        }
        .review-loc {
          font-size: 11px;
          color: #8B7B6B;
        }

        /* Final CTA */
        .final-cta {
          background: linear-gradient(rgba(44, 24, 16, 0.85), rgba(44, 24, 16, 0.85)), url('/images/hero-honey.png');
          background-size: cover;
          background-position: center;
          color: #FFFFFF;
          padding: 80px 0;
          text-align: center;
        }
        .final-cta h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .final-cta p {
          font-size: 16px;
          color: #E5E0D8;
          margin-bottom: 28px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 900px) {
          .hero-grid, .story-grid { grid-template-columns: 1fr; }
          .hero-heading { font-size: 38px; }
          .usp-grid, .why-grid, .process-grid, .showcase-grid { grid-template-columns: repeat(2, 1fr); }
          .collection-grid { grid-template-columns: repeat(3, 1fr); }
          .reviews-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 480px) {
          .collection-grid { grid-template-columns: repeat(2, 1fr); }
          .usp-grid, .why-grid, .process-grid, .showcase-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-label">KAMALA HONEY FARM</div>
              <h1 className="hero-heading">
                Pure Honey.<br />
                Naturally Harvested.
              </h1>
              <p className="hero-subtext">
                Discover naturally sourced honey from Kamala Honey Farm, Tirunelveli. Raw, unprocessed, and delivered direct from our farm to your home.
              </p>
              <div className="hero-ctas">
                <Link to="/shop" className="btn btn-primary btn-lg">
                  SHOP HONEY
                </Link>
                <Link to="/farm" className="btn btn-outline btn-lg">
                  EXPLORE OUR FARM
                </Link>
              </div>
            </div>

            <div className="hero-visual-wrapper">
              <img 
                src="/images/hero-honey.png" 
                alt="Kamala Honey Farm Product" 
                className="hero-visual-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / USP STRIP */}
      <section className="usp-strip">
        <div className="container">
          <div className="usp-grid">
            <div className="usp-item">
              <div className="usp-icon">🍯</div>
              <div>
                <div className="usp-title">Naturally Sourced</div>
                <div className="usp-subtitle">100% Raw & Unprocessed</div>
              </div>
            </div>
            <div className="usp-item">
              <div className="usp-icon">🏡</div>
              <div>
                <div className="usp-title">Farm Direct</div>
                <div className="usp-subtitle">From Farm to Doorstep</div>
              </div>
            </div>
            <div className="usp-item">
              <div className="usp-icon">✨</div>
              <div>
                <div className="usp-title">Quality Focused</div>
                <div className="usp-subtitle">Purity Guaranteed</div>
              </div>
            </div>
            <div className="usp-item">
              <div className="usp-icon">📍</div>
              <div>
                <div className="usp-title">Tirunelveli Origin</div>
                <div className="usp-subtitle">Tamil Nadu, India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">OUR SELECTION</span>
            <h2>Explore Our Honey</h2>
            <p>Hand-harvested natural honey products straight from our apiaries.</p>
          </div>

          <div className="grid grid-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. HONEY PRODUCT COLLECTION */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-label">CATEGORIES</span>
            <h2>Honey Product Collection</h2>
          </div>

          <div className="collection-grid">
            {categories.map((cat, i) => {
              const catImages = [
                '/images/product-natural-honey.png',
                '/images/product-honeycomb.png',
                '/images/product-premium-honey.png',
                '/images/product-gift-pack.png',
                '/images/product-forest-honey.png'
              ];
              return (
                <Link to={`/shop?category=${cat.slug}`} key={cat.id} className="collection-card">
                  <img src={catImages[i % catImages.length]} alt={cat.name} className="collection-img" />
                  <div className="collection-title">{cat.name}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE KAMALA */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">OUR PROMISE</span>
            <h2>Why Choose Kamala Honey</h2>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-num">01</div>
              <div className="why-title">Natural Honey Focus</div>
              <div className="why-desc">We specialize exclusively in natural honey, ensuring every bottle meets strict standards of purity and taste.</div>
            </div>
            <div className="why-card">
              <div className="why-num">02</div>
              <div className="why-title">Careful Harvesting</div>
              <div className="why-desc">Our honey is harvested using traditional methods that protect both bee colonies and natural enzymes.</div>
            </div>
            <div className="why-card">
              <div className="why-num">03</div>
              <div className="why-title">Quality Focus</div>
              <div className="why-desc">Every batch undergoes rigorous quality checks to deliver authentic raw honey to your table.</div>
            </div>
            <div className="why-card">
              <div className="why-num">04</div>
              <div className="why-title">Tirunelveli Origin</div>
              <div className="why-desc">Nurtured in the biodiverse flora of Tirunelveli, Tamil Nadu, for a rich, distinctive flavor profile.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HARVESTING STORY */}
      <section className="section section-bg">
        <div className="container">
          <div className="story-grid">
            <div>
              <img src="/images/farm-beekeeping.png" alt="Beekeeping at Kamala Farm" className="story-img" />
            </div>
            <div>
              <span className="section-label">OUR HERITAGE</span>
              <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>From Our Farm to Your Home</h2>
              <p style={{ color: '#5C4A3A', lineHeight: '1.6', marginBottom: '24px' }}>
                Kamala Honey Farm is a dedicated natural honey farm located in Tirunelveli, Tamil Nadu. We nurture healthy bee colonies and harvest honey using sustainable, traditional techniques. Every jar embodies our commitment to purity, natural nutrition, and authentic local flavor.
              </p>
              <Link to="/farm" className="btn btn-primary">
                LEARN MORE ABOUT OUR FARM
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BEEKEEPING PROCESS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">OUR WORKFLOW</span>
            <h2>Our Beekeeping Process</h2>
          </div>

          <div className="process-grid">
            <div className="process-card">
              <img src="/images/farm-beekeeping.png" alt="Beekeeping" className="process-img" />
              <div className="process-body">
                <div className="process-step">01 STEP</div>
                <div className="process-title">Beekeeping</div>
                <div className="process-desc">Maintaining healthy bee boxes in natural Tirunelveli floral surroundings.</div>
              </div>
            </div>
            <div className="process-card">
              <img src="/images/honey-harvesting.png" alt="Honey Harvesting" className="process-img" />
              <div className="process-body">
                <div className="process-step">02 STEP</div>
                <div className="process-title">Honey Harvesting</div>
                <div className="process-desc">Carefully collecting ripe honeycombs at peak natural maturity.</div>
              </div>
            </div>
            <div className="process-card">
              <img src="/images/honey-processing.png" alt="Honey Processing" className="process-img" />
              <div className="process-body">
                <div className="process-step">03 STEP</div>
                <div className="process-title">Honey Processing</div>
                <div className="process-desc">Gentle gravity filtering to preserve raw vitamins, pollen, and natural enzymes.</div>
              </div>
            </div>
            <div className="process-card">
              <img src="/images/honey-packaging.png" alt="Packaging" className="process-img" />
              <div className="process-body">
                <div className="process-step">04 STEP</div>
                <div className="process-title">Packaging</div>
                <div className="process-desc">Sealing farm-fresh honey into food-grade glass jars for customer delivery.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HONEY VISUAL SHOWCASE */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-label">GALLERY</span>
            <h2>Honey Visual Showcase</h2>
          </div>

          <div className="showcase-grid">
            <div className="showcase-item"><img src="/images/showcase-honeycomb.png" alt="Honeycomb" /></div>
            <div className="showcase-item"><img src="/images/product-honeycomb.png" alt="Dripping Honey" /></div>
            <div className="showcase-item"><img src="/images/showcase-bees.png" alt="Honey Bees" /></div>
            <div className="showcase-item"><img src="/images/hero-honey.png" alt="Honey Jars" /></div>
          </div>
        </div>
      </section>

      {/* 9. BEST SELLERS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">CUSTOMER FAVORITES</span>
            <h2>Best Selling Products</h2>
          </div>

          <div className="grid grid-4">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-label">TESTIMONIALS</span>
            <h2>What Our Customers Say</h2>
          </div>

          <div className="reviews-grid">
            {reviews.map(rev => (
              <div key={rev.id} className="review-card">
                <div className="review-stars">★★★★★</div>
                <div className="review-comment">"{rev.comment}"</div>
                <div className="review-author">{rev.name}</div>
                <div className="review-loc">{rev.location}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. INSTAGRAM SECTION */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <span className="section-label">SOCIAL</span>
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Follow Our Honey Journey</h2>
          <p style={{ color: '#5C4A3A', marginBottom: '24px' }}>Stay connected with updates from our farm on Instagram</p>
          
          <a 
            href="https://www.instagram.com/kamala_honey_farm_tirunelveli" 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-outline"
          >
            📷 @kamala_honey_farm_tirunelveli
          </a>
        </div>
      </section>

      {/* 12. FINAL CTA */}
      <section className="final-cta">
        <div className="container">
          <h2>Bring the Goodness of Natural Honey Home</h2>
          <p>Order 100% natural, raw honey harvested directly from Kamala Honey Farm in Tirunelveli.</p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            SHOP HONEY NOW
          </Link>
        </div>
      </section>
    </div>
  );
}

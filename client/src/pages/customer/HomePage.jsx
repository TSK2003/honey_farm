import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Home, 
  ShieldCheck, 
  MapPin, 
  Award, 
  ArrowRight, 
  Star, 
  Package, 
  Truck, 
  CheckCircle2,
  Tag,
  Heart
} from 'lucide-react';
import { InstagramIcon } from '../../components/Icons';
import ProductCard from '../../components/ProductCard';
import { getProducts, getCategories } from '../../services/firebaseService';

export default function HomePage() {
  const [products, setProducts] = useState([]);
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
          setProducts(prods);
        }
        if (cats && cats.length > 0) {
          // Keep top 5 prominent categories
          setCategories(cats.slice(0, 5));
        }

        setReviews([
          { 
            id: 1, 
            name: 'Senthil Kumar', 
            location: 'Palayamkottai, Tirunelveli', 
            rating: 5, 
            comment: 'The purest raw honey I have tasted. The Dry Fruits Honey is loaded with crunchy almonds, cashews, and walnuts. 100% authentic!',
            product: 'Honey Soaked Dry Fruits & Nuts'
          },
          { 
            id: 2, 
            name: 'Priya Ramesh', 
            location: 'Anna Nagar, Chennai', 
            rating: 5, 
            comment: 'The Wild Kattu Nellikai in Honey is unbelievable! Fresh wild gooseberries soaked in thick honey. An amazing daily immunity booster for my kids.',
            product: 'Wild Kattu Nellikai in Raw Honey'
          },
          { 
            id: 3, 
            name: 'Karthik Subramanian', 
            location: 'Madurai', 
            rating: 5, 
            comment: 'Premium packaging and fast delivery. The Honey Soaked Dates are rich, juicy, and healthy. Completely natural.',
            product: 'Honey Soaked Arabian Dates'
          }
        ]);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="homepage">
      <style>{`
        /* ================= HERO SECTION ================= */
        .hero-section {
          background: radial-gradient(circle at 80% 20%, rgba(212, 162, 78, 0.14) 0%, rgba(255, 248, 237, 0.9) 45%, #FBF8F3 100%);
          padding: 64px 0 80px;
          border-bottom: 1px solid #E8DFD3;
          position: relative;
          overflow: hidden;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
        }
        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFF8ED;
          border: 1px solid rgba(193, 120, 23, 0.35);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          color: #C17817;
          margin-bottom: 18px;
          box-shadow: 0 2px 8px rgba(193, 120, 23, 0.08);
        }
        .hero-heading {
          font-family: var(--font-heading);
          font-size: 52px;
          font-weight: 800;
          color: #2C1810;
          line-height: 1.12;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .hero-heading span {
          background: linear-gradient(135deg, #C17817 0%, #D48C2E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtext {
          font-size: 16.5px;
          color: #5C4A3A;
          line-height: 1.65;
          margin-bottom: 32px;
          max-width: 540px;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }
        .hero-ratings-strip {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid #E8DFD3;
        }
        .hero-star-group {
          display: flex;
          gap: 2px;
          color: #D4A24E;
        }
        .hero-rating-text {
          font-size: 13px;
          font-weight: 600;
          color: #2C1810;
        }

        /* Hero Visual Frame */
        .hero-visual-box {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-main-img {
          width: 100%;
          max-width: 440px;
          height: auto;
          border-radius: 16px;
          box-shadow: 0 20px 48px rgba(44, 24, 16, 0.16);
          border: 4px solid #FFFFFF;
          transition: transform 300ms ease;
        }
        .hero-main-img:hover {
          transform: scale(1.02);
        }
        .hero-floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          padding: 12px 18px;
          border-radius: 12px;
          border: 1px solid #E8DFD3;
          box-shadow: 0 10px 24px rgba(44, 24, 16, 0.12);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .floating-card-1 {
          bottom: 20px;
          left: -10px;
        }
        .floating-card-2 {
          top: 20px;
          right: -10px;
        }

        /* ================= TRUST STRIP ================= */
        .trust-strip {
          background: #2C1810;
          color: #FFFFFF;
          padding: 28px 0;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .trust-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          background: rgba(193, 120, 23, 0.2);
          color: #D4A24E;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(212, 162, 78, 0.3);
        }
        .trust-title {
          font-family: var(--font-heading);
          font-size: 14.5px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 2px;
        }
        .trust-sub {
          font-size: 12px;
          color: #A69686;
        }

        /* ================= CATEGORIES ROUND GRID ================= */
        .category-showcase-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }
        .cat-card-modern {
          background: #FFFFFF;
          border: 1px solid #E8DFD3;
          border-radius: 12px;
          padding: 20px 14px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          transition: all 250ms ease;
          box-shadow: 0 2px 8px rgba(44, 24, 16, 0.04);
        }
        .cat-card-modern:hover {
          border-color: #C17817;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(193, 120, 23, 0.15);
        }
        .cat-img-wrapper {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          overflow: hidden;
          background: #FBF8F3;
          margin-bottom: 14px;
          border: 2px solid #F0D48A;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cat-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 200ms ease;
        }
        .cat-card-modern:hover .cat-img-wrapper img {
          transform: scale(1.08);
        }
        .cat-title-modern {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          color: #2C1810;
          margin-bottom: 4px;
        }
        .cat-count-sub {
          font-size: 11.5px;
          color: #C17817;
          font-weight: 600;
        }

        /* ================= WHY CHOOSE ================= */
        .why-card-modern {
          background: #FFFFFF;
          border: 1px solid #E8DFD3;
          border-radius: 12px;
          padding: 28px 24px;
          position: relative;
          transition: all 250ms ease;
        }
        .why-card-modern:hover {
          border-color: #C17817;
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(193, 120, 23, 0.1);
        }
        .why-badge-num {
          font-family: var(--font-heading);
          font-size: 26px;
          font-weight: 800;
          color: #C17817;
          margin-bottom: 10px;
        }
        .why-title-text {
          font-family: var(--font-heading);
          font-size: 16.5px;
          font-weight: 700;
          color: #2C1810;
          margin-bottom: 8px;
        }
        .why-desc-text {
          font-size: 13.5px;
          color: #5C4A3A;
          line-height: 1.55;
        }

        /* ================= FARM STORY SPLIT ================= */
        .farm-story-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .farm-story-img-wrap {
          position: relative;
        }
        .farm-story-img {
          width: 100%;
          border-radius: 14px;
          box-shadow: 0 14px 32px rgba(44, 24, 16, 0.12);
        }
        .farm-story-badge {
          position: absolute;
          bottom: -16px;
          right: 24px;
          background: #2C1810;
          color: #FBF8F3;
          padding: 12px 20px;
          border-radius: 10px;
          border: 1px solid #D4A24E;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ================= REVIEWS TESTIMONIALS ================= */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .testimonial-card-modern {
          background: #FFFFFF;
          border: 1px solid #E8DFD3;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .testimonial-stars {
          display: flex;
          gap: 3px;
          color: #D4A24E;
          margin-bottom: 12px;
        }
        .testimonial-text {
          font-size: 14px;
          color: #2C1810;
          line-height: 1.6;
          margin-bottom: 16px;
          font-style: italic;
        }
        .testimonial-author {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          color: #2C1810;
        }
        .testimonial-location {
          font-size: 11.5px;
          color: #8B7B6B;
          margin-top: 2px;
        }

        /* ================= FINAL CTA ================= */
        .final-cta-section {
          background: linear-gradient(rgba(44, 24, 16, 0.92), rgba(44, 24, 16, 0.92)), url('/images/hero-honey.png');
          background-size: cover;
          background-position: center;
          color: #FFFFFF;
          padding: 80px 0;
          text-align: center;
        }

        @media (max-width: 950px) {
          .hero-grid, .farm-story-layout { grid-template-columns: 1fr; }
          .hero-heading { font-size: 40px; }
          .trust-grid, .why-grid { grid-template-columns: repeat(2, 1fr); }
          .category-showcase-grid { grid-template-columns: repeat(3, 1fr); }
          .testimonials-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 550px) {
          .trust-grid, .category-showcase-grid { grid-template-columns: 1fr; }
          .hero-heading { font-size: 32px; }
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge-pill">
                <Sparkles size={15} />
                <span>100% PURE TIRUNELVELI APIARY HARVEST</span>
              </div>

              <h1 className="hero-heading">
                Pure Natural Honey.<br />
                <span>Naturally Harvested.</span>
              </h1>

              <p className="hero-subtext">
                Discover authentic raw honey, honey-soaked dry fruits, and kattu nellikai sourced directly from Honey Bee Farm apiaries in Tirunelveli, Tamil Nadu. Cold-extracted, unprocessed, and delivered fresh to your doorstep.
              </p>

              <div className="hero-ctas">
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <span>SHOP NATURAL HONEY</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/farm" className="btn btn-outline btn-lg">
                  EXPLORE OUR APIARIES
                </Link>
              </div>

              <div className="hero-ratings-strip">
                <div className="hero-star-group">
                  <Star size={16} fill="#D4A24E" color="#D4A24E" />
                  <Star size={16} fill="#D4A24E" color="#D4A24E" />
                  <Star size={16} fill="#D4A24E" color="#D4A24E" />
                  <Star size={16} fill="#D4A24E" color="#D4A24E" />
                  <Star size={16} fill="#D4A24E" color="#D4A24E" />
                </div>
                <div className="hero-rating-text">
                  <strong>4.9 / 5.0 Rating</strong> from 3,200+ Farm-Direct Customers
                </div>
              </div>
            </div>

            {/* Hero Visual Box */}
            <div className="hero-visual-box">
              <img 
                src="/images/product-honey-dry-fruits.png" 
                alt="Honey Bee Farm Dry Fruits Honey" 
                className="hero-main-img"
              />
              <div className="hero-floating-card floating-card-1">
                <ShieldCheck size={24} color="#4A7C59" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2C1810' }}>100% Raw & Pure</div>
                  <div style={{ fontSize: '11px', color: '#8B7B6B' }}>Zero Added Sugar or Heating</div>
                </div>
              </div>
              <div className="hero-floating-card floating-card-2">
                <Award size={24} color="#C17817" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2C1810' }}>Direct Farm Origin</div>
                  <div style={{ fontSize: '11px', color: '#8B7B6B' }}>Tirunelveli, Tamil Nadu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / VALUE STRIP */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon-box"><Sparkles size={22} /></div>
              <div>
                <div className="trust-title">Naturally Sourced</div>
                <div className="trust-sub">100% Raw & Unprocessed</div>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box"><Home size={22} /></div>
              <div>
                <div className="trust-title">Farm Direct Apiary</div>
                <div className="trust-sub">Straight from Beehive to Jar</div>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box"><ShieldCheck size={22} /></div>
              <div>
                <div className="trust-title">Strict Purity Testing</div>
                <div className="trust-sub">Enzyme & Pollen Rich</div>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon-box"><Truck size={22} /></div>
              <div>
                <div className="trust-title">Fast Insured Delivery</div>
                <div className="trust-sub">Free Delivery Over ₹500</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE CATEGORIES (Clean 5-Item Showcase) */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '36px' }}>
            <span className="section-label">CURATED COLLECTIONS</span>
            <h2>Explore Honey Varieties</h2>
            <p>Hand-harvested pure honey and traditional honey-infused wellness products.</p>
          </div>

          <div className="category-showcase-grid">
            {categories.map((cat) => {
              const imageMap = {
                'dry-fruits-honey': '/images/product-honey-dry-fruits.png',
                'kattu-nellikai-honey': '/images/product-honey-kattu-nellikai.png',
                'dates-honey': '/images/product-honey-dates.png',
                'raw-honey': '/images/product-natural-honey.png',
                'comb-honey': '/images/product-honeycomb.png'
              };
              const catImg = imageMap[cat.slug] || '/images/product-natural-honey.png';
              return (
                <Link to={`/shop?category=${cat.slug}`} key={cat.id} className="cat-card-modern">
                  <div className="cat-img-wrapper">
                    <img src={catImg} alt={cat.name} />
                  </div>
                  <div className="cat-title-modern">{cat.name}</div>
                  <div className="cat-count-sub">View Products →</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ALL NATURAL HONEY PRODUCTS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">OUR COMPLETE SELECTION</span>
            <h2>Natural Honey & Infusions</h2>
            <p>Pure honey, dry fruit blends, kattu nellikai, and dates in airtight food-grade jars.</p>
          </div>

          <div className="grid grid-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE HONEY BEE FARM */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-label">THE HONEY BEE PROMISE</span>
            <h2>Why Choose Honey Bee Farm</h2>
            <p>Our ethical beekeeping practices prioritize bee wellbeing and authentic nutritional purity.</p>
          </div>

          <div className="grid grid-4">
            <div className="why-card-modern">
              <div className="why-badge-num">01</div>
              <div className="why-title-text">Pure Raw Extraction</div>
              <div className="why-desc-text">We never pasteurize or micro-filter our honey, ensuring all beneficial bee pollen and active enzymes remain intact.</div>
            </div>
            <div className="why-card-modern">
              <div className="why-badge-num">02</div>
              <div className="why-title-text">Ethical Beekeeping</div>
              <div className="why-desc-text">Our bee boxes are maintained in natural floral surroundings, harvesting only surplus honey so colonies thrive year-round.</div>
            </div>
            <div className="why-card-modern">
              <div className="why-badge-num">03</div>
              <div className="why-title-text">Zero Artificial Sugars</div>
              <div className="why-desc-text">Every single batch is 100% pure honey with no added invert sugars, high fructose corn syrup, or artificial preservatives.</div>
            </div>
            <div className="why-card-modern">
              <div className="why-badge-num">04</div>
              <div className="why-title-text">Tirunelveli Bio-Origin</div>
              <div className="why-desc-text">Nurtured in the biodiverse floral climate of Tirunelveli, Tamil Nadu, for a distinct, exquisite taste profile.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. APIARY STORY */}
      <section className="section">
        <div className="container">
          <div className="farm-story-layout">
            <div className="farm-story-img-wrap">
              <img src="/images/farm-beekeeping.png" alt="Beekeeping at Honey Bee Farm" className="farm-story-img" />
              <div className="farm-story-badge">
                <MapPin size={22} color="#D4A24E" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Tirunelveli Apiaries</div>
                  <div style={{ fontSize: '11px', color: '#A69686' }}>Tamil Nadu, India</div>
                </div>
              </div>
            </div>
            <div>
              <span className="section-label">OUR APIARY STORY</span>
              <h2 style={{ fontSize: '34px', marginBottom: '16px', lineHeight: '1.2' }}>From Our Apiaries Direct to Your Home</h2>
              <p style={{ color: '#5C4A3A', lineHeight: '1.7', marginBottom: '16px', fontSize: '15px' }}>
                Honey Bee Farm is a dedicated natural honey farm located in Tirunelveli, Tamil Nadu. We manage healthy, thriving bee colonies in biodiverse floral locations and harvest honey using sustainable, age-old methods.
              </p>
              <p style={{ color: '#5C4A3A', lineHeight: '1.7', marginBottom: '28px', fontSize: '15px' }}>
                Every jar embodies our commitment to purity, natural nutrition, and authentic local flavor. Enjoy nature's finest liquid gold straight from the comb.
              </p>
              <Link to="/farm" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>LEARN ABOUT OUR APIARY PROCESS</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VERIFIED CUSTOMER REVIEWS */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-label">TESTIMONIALS</span>
            <h2>What Our Customers Say</h2>
            <p>Read authentic feedback from honey lovers across India.</p>
          </div>

          <div className="testimonials-grid">
            {reviews.map(rev => (
              <div key={rev.id} className="testimonial-card-modern">
                <div>
                  <div className="testimonial-stars">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} size={15} fill="#D4A24E" color="#D4A24E" />
                    ))}
                  </div>
                  <div className="testimonial-text">"{rev.comment}"</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#C17817', fontWeight: 700, marginBottom: '2px' }}>
                    Purchased: {rev.product}
                  </div>
                  <div className="testimonial-author">{rev.name}</div>
                  <div className="testimonial-location">{rev.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM SOCIAL */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <span className="section-label">FOLLOW OUR JOURNEY</span>
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Follow Honey Bee Farm on Instagram</h2>
          <p style={{ color: '#5C4A3A', marginBottom: '24px' }}>Catch live video stories of harvesting and beekeeping in Tirunelveli.</p>
          
          <a 
            href="https://www.instagram.com/honey_bee_farm_tirunelveli" 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <InstagramIcon size={18} />
            <span>@honey_bee_farm_tirunelveli</span>
          </a>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="final-cta-section">
        <div className="container">
          <h2 style={{ fontSize: '36px', color: '#FFFFFF', marginBottom: '16px' }}>
            Bring the Goodness of Natural Honey Home
          </h2>
          <p style={{ color: '#E8DFD3', fontSize: '16px', marginBottom: '28px', maxWidth: '520px', margin: '0 auto 28px' }}>
            Order 100% natural raw honey, dry fruits honey, and kattu nellikai harvested directly from Honey Bee Farm apiaries in Tirunelveli.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>SHOP HONEY NOW</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

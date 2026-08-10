import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { getProducts, getCategories } from '../../services/firebaseService';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortOption = searchParams.get('sort') || 'newest';
  const selectedWeight = searchParams.get('weight') || '';
  const availability = searchParams.get('availability') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  async function fetchCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const options = {
        category: selectedCategory,
        search: searchQuery,
        sort: sortOption,
        weight: selectedWeight
      };

      const data = await getProducts(options);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCategoryChange = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) newParams.set('category', slug);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    setSearchParams(newParams);
  };

  const handleWeightChange = (weight) => {
    const newParams = new URLSearchParams(searchParams);
    if (weight) newParams.set('weight', weight);
    else newParams.delete('weight');
    setSearchParams(newParams);
  };

  return (
    <div className="shop-page section">
      <style>{`
        .shop-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
        }
        .filter-sidebar {
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          border-radius: 6px;
          padding: 20px;
          height: fit-content;
        }
        .filter-group {
          margin-bottom: 24px;
        }
        .filter-title {
          font-size: 14px;
          font-weight: 700;
          color: #2C1810;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .filter-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .filter-btn {
          text-align: left;
          font-size: 13px;
          color: #5C4A3A;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 150ms ease;
        }
        .filter-btn:hover, .filter-btn.active {
          background: #FFF8ED;
          color: #C17817;
          font-weight: 600;
        }
        .shop-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #E5E0D8;
        }
        @media (max-width: 850px) {
          .shop-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '24px' }}>
          <h2>Shop Honey Products</h2>
          <p>Pure, unprocessed natural honey harvested directly from Kamala Honey Farm.</p>
        </div>

        <div className="shop-layout">
          {/* Filters Sidebar */}
          <aside className="filter-sidebar">
            {/* Categories */}
            <div className="filter-group">
              <div className="filter-title">Category</div>
              <div className="filter-list">
                <button
                  className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  All Products
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.slug)}
                  >
                    {cat.name} ({cat.product_count || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Filter */}
            <div className="filter-group">
              <div className="filter-title">Weight</div>
              <div className="filter-list">
                {['', '250g', '500g', '1kg'].map(w => (
                  <button
                    key={w}
                    className={`filter-btn ${selectedWeight === w ? 'active' : ''}`}
                    onClick={() => handleWeightChange(w)}
                  >
                    {w ? w : 'All Weights'}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Product Area */}
          <div>
            <div className="shop-header-bar">
              <div style={{ fontSize: '14px', color: '#5C4A3A' }}>
                Showing <strong>{products.length}</strong> products
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500 }}>Sort By:</label>
                <select 
                  className="form-select" 
                  style={{ width: 'auto', padding: '6px 12px' }}
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="newest">Newest Arrival</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loader"><div className="spinner"></div></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🍯</div>
                <h3>No Honey Products Found</h3>
                <p>Try adjusting your search query or clear filters.</p>
              </div>
            ) : (
              <div className="grid grid-3">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

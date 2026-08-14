import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageSearch, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
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

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="shop-page section">
      <style>{`
        .shop-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 32px;
        }
        .filter-sidebar {
          background: #FFFFFF;
          border: 1px solid #E8DFD3;
          border-radius: 12px;
          padding: 24px;
          height: fit-content;
          box-shadow: 0 2px 8px rgba(44, 24, 16, 0.04);
        }
        .filter-group {
          margin-bottom: 24px;
        }
        .filter-title {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          color: #2C1810;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .filter-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .filter-btn {
          text-align: left;
          font-size: 13.5px;
          color: #5C4A3A;
          padding: 8px 12px;
          border-radius: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
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
          border-bottom: 1px solid #E8DFD3;
          flex-wrap: wrap;
          gap: 12px;
        }
        @media (max-width: 850px) {
          .shop-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '28px' }}>
          <span className="section-label">FARM CATALOG</span>
          <h2>Shop Natural Honey Products</h2>
          <p>Pure, unprocessed natural honey harvested directly from Honey Bee Farm apiaries in Tirunelveli.</p>
        </div>

        <div className="shop-layout">
          {/* Filters Sidebar */}
          <aside className="filter-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E8DFD3', paddingBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <SlidersHorizontal size={16} color="#C17817" /> Filter Harvest
              </span>
              {(selectedCategory || selectedWeight || searchQuery) && (
                <button 
                  onClick={clearAllFilters}
                  style={{ background: 'none', border: 'none', color: '#C17817', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="filter-group">
              <div className="filter-title">Category</div>
              <div className="filter-list">
                <button
                  className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  All Honey Types
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat.slug)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Filter */}
            <div className="filter-group">
              <div className="filter-title">Net Weight</div>
              <div className="filter-list">
                {['', '250g', '500g', '1kg'].map(w => (
                  <button
                    key={w}
                    className={`filter-btn ${selectedWeight === w ? 'active' : ''}`}
                    onClick={() => handleWeightChange(w)}
                  >
                    {w ? w : 'All Available Sizes'}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Product Area */}
          <div>
            <div className="shop-header-bar">
              <div style={{ fontSize: '14px', color: '#5C4A3A' }}>
                Showing <strong>{products.length}</strong> natural honey products
                {searchQuery && <span> for "<strong>{searchQuery}</strong>"</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpDown size={14} /> Sort:
                </label>
                <select 
                  className="form-select" 
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
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
              <div className="empty-state" style={{ background: '#FFFFFF', border: '1px solid #E8DFD3', borderRadius: '12px', padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: '#FFF8ED', color: '#C17817', marginBottom: '16px' }}>
                  <PackageSearch size={36} />
                </div>
                <h3>No Honey Products Found</h3>
                <p style={{ color: '#5C4A3A', maxWidth: '360px', margin: '8px auto 20px' }}>
                  Try adjusting your search query or reset filters to view all products.
                </p>
                <button onClick={clearAllFilters} className="btn btn-primary btn-sm">
                  Clear All Filters
                </button>
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

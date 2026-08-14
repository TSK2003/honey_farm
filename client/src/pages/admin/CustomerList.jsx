import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Eye, Search, RefreshCw, ShoppingBag, IndianRupee, Phone, Mail } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { getCustomers } from '../../services/firebaseService';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchCustomersData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error('Error loading real-time customers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomersData();
  }, []);

  // Filter by search query
  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.id && c.id.toLowerCase().includes(q))
    );
  });

  // Calculate summary metrics
  const totalCustomers = customers.length;
  const activeBuyers = customers.filter(c => (c.order_count || 0) > 0).length;
  const totalCustomerSpend = customers.reduce((sum, c) => sum + (Number(c.total_spent) || 0), 0);

  return (
    <AdminLayout title="Registered & Order Customers">
      {/* Metric Cards */}
      <div className="grid grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Total Customers</div>
            <Users size={18} color="#C17817" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#2C1810', marginTop: '6px' }}>{totalCustomers}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Live profiles across store</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Active Buyers</div>
            <ShoppingBag size={18} color="#4A7C59" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#4A7C59', marginTop: '6px' }}>{activeBuyers}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Placed 1 or more orders</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Customer Lifetime Value</div>
            <IndianRupee size={18} color="#C17817" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#C17817', marginTop: '6px' }}>₹{totalCustomerSpend}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Cumulative customer sales</div>
        </div>
      </div>

      {/* Search & Refresh Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by customer name, phone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B7B6B' }} />
        </div>

        <button
          onClick={() => fetchCustomersData(true)}
          className="btn btn-outline"
          disabled={refreshing}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
        >
          <RefreshCw size={14} className={refreshing ? 'spinner' : ''} />
          <span>{refreshing ? 'Syncing...' : 'Live Firestore Refresh'}</span>
        </button>
      </div>

      {/* Main Table */}
      <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '10px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : filteredCustomers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8B7B6B' }}>
            <Users size={36} color="#C17817" style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ fontSize: '14px', fontWeight: 600 }}>No customer accounts match your search.</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Registered buyers and order customers in Firestore will appear here automatically.</p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Contact Email</th>
                  <th>Mobile Phone</th>
                  <th>Orders Placed</th>
                  <th>Total Spent</th>
                  <th>Joined Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF8ED', border: '1px solid #F0D48A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#C17817', fontSize: '13px' }}>
                          {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <span style={{ fontWeight: 600, color: '#2C1810' }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ color: '#5C4A3A', fontSize: '13px' }}>{c.email || 'N/A'}</td>
                    <td>
                      {c.phone ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#2C1810', fontWeight: 500 }}>
                          <Phone size={12} color="#8B7B6B" />
                          <span>{c.phone}</span>
                        </span>
                      ) : (
                        <span style={{ color: '#8B7B6B', fontSize: '12px' }}>N/A</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${c.order_count > 0 ? 'badge-primary' : 'badge-gray'}`} style={{ fontWeight: 600 }}>
                        {c.order_count || 0} order(s)
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#C17817', fontSize: '14px' }}>₹{c.total_spent || 0}</td>
                    <td style={{ fontSize: '12px', color: '#8B7B6B' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>
                      <Link to={`/admin/customers/${c.id}`} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <Eye size={13} />
                        <span>View Orders</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


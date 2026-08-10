import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CategoryList() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch('/api/categories/admin/all', {
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify({ ...newCategory, slug })
      });
      if (res.ok) {
        addToast('Category created', 'success');
        setNewCategory({ name: '', slug: '', description: '' });
        fetchCategories();
      }
    } catch (err) {
      addToast('Error creating category', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category? Products will become uncategorized.')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      if (res.ok) {
        addToast('Category deleted', 'success');
        fetchCategories();
      }
    } catch (err) {
      addToast('Error deleting category', 'error');
    }
  };

  return (
    <AdminLayout title="Category Management">
      <div className="grid grid-2" style={{ gap: '24px' }}>
        {/* Create */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Add Honey Category</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input type="text" className="form-input" value={newCategory.name} onChange={(e) => setNewCategory({...newCategory, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Slug</label>
              <input type="text" className="form-input" value={newCategory.slug} onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})} placeholder="Auto-generated" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input type="text" className="form-input" value={newCategory.description} onChange={(e) => setNewCategory({...newCategory, description: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">ADD CATEGORY</button>
          </form>
        </div>

        {/* List */}
        <div className="table-container" style={{ background: 'white' }}>
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Slug</th><th>Products</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: '#8B7B6B' }}>{c.slug}</td>
                  <td>{c.product_count}</td>
                  <td>
                    <button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

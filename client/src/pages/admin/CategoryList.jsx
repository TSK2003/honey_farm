import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getCategories, saveCategory, deleteCategory } from '../../services/firebaseService';

export default function CategoryList() {
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
      const data = await getCategories();
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
      await saveCategory({ ...newCategory, slug });
      addToast('Category created successfully!', 'success');
      setNewCategory({ name: '', slug: '', description: '' });
      fetchCategories();
    } catch (err) {
      addToast('Error creating category', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category? Products in this category will remain unaffected.')) return;
    try {
      await deleteCategory(id);
      addToast('Category deleted', 'success');
      fetchCategories();
    } catch (err) {
      addToast('Error deleting category', 'error');
    }
  };

  return (
    <AdminLayout title="Category Management">
      <div className="grid grid-2" style={{ gap: '32px' }}>
        {/* Create form */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Add Honey Category</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input
                type="text"
                className="form-input"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slug</label>
              <input
                type="text"
                className="form-input"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                placeholder="Auto-generated if blank"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows="3"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>ADD CATEGORY</button>
          </form>
        </div>

        {/* List */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Existing Categories ({categories.length})</h3>

          {loading ? (
            <div className="loader"><div className="spinner"></div></div>
          ) : categories.length === 0 ? (
            <p style={{ color: '#8B7B6B', fontSize: '13px' }}>No categories created yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ color: '#8B7B6B', fontSize: '12px' }}>{c.slug}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{ color: '#C44B3F', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

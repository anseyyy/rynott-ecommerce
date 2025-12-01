import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { isAdmin, isAuthenticated } from '../../services/commonAPI';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkUpdateCategoryStatus
} from '../../services/allAPI';
import './CategoryManagement.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        slug: '',
        parentCategory: '',
        isActive: true,
        sortOrder: 0,
        metaTitle: '',
        metaDescription: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    // Check authentication and admin role
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Category name is required';
        if (!formData.slug.trim()) return 'Slug is required';

        // Check if slug is unique
        const slugExists = categories.some(cat =>
            cat.slug === formData.slug &&
            cat._id !== editingCategory?._id
        );
        if (slugExists) return 'Slug must be unique';

        return null;
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: prev.slug || generateSlug(name)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const categoryData = {
                ...formData,
                sortOrder: parseInt(formData.sortOrder) || 0
            };

            let result;
            if (editingCategory) {
                result = await updateCategory(editingCategory._id, categoryData);
            } else {
                result = await createCategory(categoryData);
            }

            if (result.success) {
                await fetchCategories();
                closeModal();
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Failed to save category:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            slug: category.slug,
            parentCategory: category.parentCategory || '',
            isActive: category.isActive,
            sortOrder: category.sortOrder || 0,
            metaTitle: category.metaTitle || '',
            metaDescription: category.metaDescription || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const result = await deleteCategory(categoryId);
                if (result.success) {
                    await fetchCategories();
                } else {
                    setError(result.message);
                }
            } catch (error) {
                console.error('Failed to delete category:', error);
                setError(error.message);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedCategories.length === 0) return;

        if (window.confirm(`Are you sure you want to delete ${selectedCategories.length} categories?`)) {
            try {
                for (const categoryId of selectedCategories) {
                    await deleteCategory(categoryId);
                }
                await fetchCategories();
                setSelectedCategories([]);
            } catch (error) {
                console.error('Failed to delete categories:', error);
                setError('Failed to delete categories');
            }
        }
    };

    const handleBulkStatusUpdate = async (isActive) => {
        if (selectedCategories.length === 0) return;

        try {
            await bulkUpdateCategoryStatus(selectedCategories, isActive);
            await fetchCategories();
            setSelectedCategories([]);
        } catch (error) {
            console.error('Failed to update categories:', error);
            setError('Failed to update categories');
        }
    };

    const openModal = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            description: '',
            slug: '',
            parentCategory: '',
            isActive: true,
            sortOrder: 0,
            metaTitle: '',
            metaDescription: ''
        });
        setError(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setError(null);
    };

    const toggleCategorySelection = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const toggleSelectAll = () => {
        setSelectedCategories(
            selectedCategories.length === filteredCategories.length
                ? []
                : filteredCategories.map(c => c._id)
        );
    };

    // Filter categories based on search and status
    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && category.isActive) ||
            (filterStatus === 'inactive' && !category.isActive);
        return matchesSearch && matchesStatus;
    });

    if (loading && categories.length === 0) {
        return (
            <div className="admin-loading">
                <div className="spinner-large"></div>
                <p>Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="category-management">
            <div className="management-header">
                <div className="management-hero">
                    <img
                        src="https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1350&q=80"
                        alt="Manage categories"
                        className="page-hero-image management-hero-img"
                    />
                    <div>
                        <h1>Category Management</h1>
                        <p>Manage your product categories</p>
                    </div>
                </div>
                <button onClick={openModal} className="btn btn-primary">
                    <i className="fas fa-plus"></i>
                    Add Category
                </button>
            </div>

            {/* Filters and Search */}
            <div className="filters-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Categories</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                {selectedCategories.length > 0 && (
                    <div className="bulk-actions">
                        <button
                            onClick={() => handleBulkStatusUpdate(true)}
                            className="btn btn-small btn-success"
                        >
                            Activate Selected
                        </button>
                        <button
                            onClick={() => handleBulkStatusUpdate(false)}
                            className="btn btn-small btn-warning"
                        >
                            Deactivate Selected
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="btn btn-small btn-danger"
                        >
                            Delete Selected ({selectedCategories.length})
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)} className="btn btn-small">
                        ×
                    </button>
                </div>
            )}

            {/* Categories Table */}
            <div className="categories-table-container">
                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.length === filteredCategories.length && filteredCategories.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Parent Category</th>
                            <th>Sort Order</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map(category => (
                            <tr key={category._id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category._id)}
                                        onChange={() => toggleCategorySelection(category._id)}
                                    />
                                </td>
                                <td>
                                    <div className="category-info">
                                        <h4>{category.name}</h4>
                                        {category.description && (
                                            <p className="category-description">{category.description}</p>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <code>{category.slug}</code>
                                </td>
                                <td>
                                    {category.parentCategory?.name || '-'}
                                </td>
                                <td>{category.sortOrder || 0}</td>
                                <td>
                                    <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="btn btn-small btn-edit"
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="btn btn-small btn-delete"
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredCategories.length === 0 && !loading && (
                <div className="no-categories">
                    <p>No categories found</p>
                    <button onClick={openModal} className="btn btn-primary">
                        Add Your First Category
                    </button>
                </div>
            )}

            {/* Add/Edit Category Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                            <button onClick={closeModal} className="modal-close">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="category-form">
                            <div className="form-section">
                                <h3>Basic Information</h3>

                                <div className="form-group">
                                    <label>Category Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Slug *</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="category-slug"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Brief description of the category"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Parent Category</label>
                                    <select
                                        name="parentCategory"
                                        value={formData.parentCategory}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">No Parent (Root Category)</option>
                                        {categories
                                            .filter(cat =>
                                                cat._id !== editingCategory?._id && // Don't allow self-parenting
                                                !isDescendant(cat._id, editingCategory?._id, categories) // Don't allow circular references
                                            )
                                            .map(category => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Sort Order</label>
                                        <input
                                            type="number"
                                            name="sortOrder"
                                            value={formData.sortOrder}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                            />
                                            Active Category
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>SEO Information (Optional)</h3>

                                <div className="form-group">
                                    <label>Meta Title</label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleInputChange}
                                        placeholder="SEO title for search engines"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Meta Description</label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="SEO description for search engines"
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper function to check if a category is a descendant of another
const isDescendant = (parentId, childId, categories = [], visited = new Set()) => {
    if (parentId === childId || visited.has(parentId)) return false;
    visited.add(parentId);

    const category = categories.find(c => c._id === parentId);
    if (!category || !category.parentCategory) return false;

    if (category.parentCategory._id === childId) return true;

    return isDescendant(category.parentCategory._id, childId, categories, visited);
};

export default CategoryManagement;
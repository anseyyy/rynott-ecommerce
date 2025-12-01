import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { isAdmin, isAuthenticated, formatPrice } from '../../services/commonAPI';
import {
    getProducts,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    deleteProductImage
} from '../../services/allAPI';
import CategoryDropdown from '../../components/CategoryDropdown';
import './ProductManagement.css';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const fileInputRef = useRef();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compareAtPrice: '',
        costPrice: '',
        sku: '',
        stockQuantity: '',
        category: '',
        brand: '',
        status: 'active',
        tags: '',
        featured: false
    });

    const [imageFiles, setImageFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsResponse, categoriesResponse] = await Promise.all([
                getProducts(),
                getCategories()
            ]);

            if (productsResponse.success) {
                setProducts(productsResponse.data);
            }

            if (categoriesResponse.success) {
                setCategories(categoriesResponse.data);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Build a hierarchical category list and flatten it with depth for indented select options
    const buildCategoryTree = (list = []) => {
        const map = {};
        list.forEach(c => {
            map[c._id] = { ...c, children: [] };
        });

        const roots = [];
        list.forEach(c => {
            const parentId = c.parentCategory?._id || c.parentCategory;
            if (parentId && map[parentId]) {
                map[parentId].children.push(map[c._id]);
            } else {
                roots.push(map[c._id]);
            }
        });

        return roots;
    };

    const flattenWithDepth = (nodes = [], depth = 0, out = []) => {
        nodes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        nodes.forEach(n => {
            out.push({ ...n, depth });
            if (n.children && n.children.length) {
                flattenWithDepth(n.children, depth + 1, out);
            }
        });
        return out;
    };

    // Check authentication and admin role
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Product name is required';
        if (!formData.description.trim()) return 'Description is required';
        if (!formData.price || parseFloat(formData.price) <= 0) return 'Valid price is required';
        if (!formData.category) return 'Category is required';
        if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) return 'Valid stock quantity is required';
        return null;
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

            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
                costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
                stockQuantity: parseInt(formData.stockQuantity),
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
            };

            let result;
            if (editingProduct) {
                result = await updateProduct(editingProduct._id, productData);
            } else {
                result = await createProduct(productData);
            }

            if (result.success) {
                // Upload images if any
                if (imageFiles.length > 0) {
                    await handleImageUpload(result.data._id);
                }

                await fetchData();
                closeModal();
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Failed to save product:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (productId) => {
        const uploadPromises = imageFiles.map(async (file, index) => {
            try {
                setUploadProgress(prev => ({ ...prev, [index]: 'uploading' }));

                const formData = new FormData();
                formData.append('images', file);

                const response = await fetch(`/api/products/${productId}/images`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    setUploadProgress(prev => ({ ...prev, [index]: 'completed' }));
                } else {
                    setUploadProgress(prev => ({ ...prev, [index]: 'error' }));
                }

                return result;
            } catch (error) {
                setUploadProgress(prev => ({ ...prev, [index]: 'error' }));
                throw error;
            }
        });

        try {
            await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Some image uploads failed:', error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            compareAtPrice: product.compareAtPrice?.toString() || '',
            costPrice: product.costPrice?.toString() || '',
            sku: product.sku || '',
            stockQuantity: product.stockQuantity.toString(),
            category: product.category._id,
            brand: product.brand || '',
            status: product.status,
            tags: product.tags?.join(', ') || '',
            featured: product.featured
        });
        setShowModal(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const result = await deleteProduct(productId);
                if (result.success) {
                    await fetchData();
                } else {
                    setError(result.message);
                }
            } catch (error) {
                console.error('Failed to delete product:', error);
                setError(error.message);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) return;

        if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
            try {
                for (const productId of selectedProducts) {
                    await deleteProduct(productId);
                }
                await fetchData();
                setSelectedProducts([]);
            } catch (error) {
                console.error('Failed to delete products:', error);
                setError('Failed to delete products');
            }
        }
    };

    const openModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            compareAtPrice: '',
            costPrice: '',
            sku: '',
            stockQuantity: '',
            category: '',
            brand: '',
            status: 'active',
            tags: '',
            featured: false
        });
        setImageFiles([]);
        setError(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setImageFiles([]);
        setError(null);
        setUploadProgress({});
    };

    const toggleProductSelection = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const toggleSelectAll = () => {
        setSelectedProducts(
            selectedProducts.length === filteredProducts.length
                ? []
                : filteredProducts.map(p => p._id)
        );
    };

    // Filter products based on search and status
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading && products.length === 0) {
        return (
            <div className="admin-loading">
                <div className="spinner-large"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="product-management">
            <div className="management-header">
                <div className="management-hero">
                    <img
                        src="https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1350&q=80"
                        alt="Manage products"
                        className="page-hero-image management-hero-img"
                    />
                    <div>
                        <h1>Product Management</h1>
                        <p>Manage your product catalog</p>
                    </div>
                </div>
                <button onClick={openModal} className="btn btn-primary">
                    <i className="fas fa-plus"></i>
                    Add Product
                </button>
            </div>


            {/* Filters and Search */}
            <div className="filters-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search products..."
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
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                </select>

                {selectedProducts.length > 0 && (
                    <button onClick={handleBulkDelete} className="btn btn-danger">
                        Delete Selected ({selectedProducts.length})
                    </button>
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

            {/* Products Table */}
            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product._id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product._id)}
                                        onChange={() => toggleProductSelection(product._id)}
                                    />
                                </td>
                                <td>
                                    <div className="product-info">
                                        <img
                                            src={product.images?.[0]?.url || '/images/default-product.png'}
                                            alt={product.name}
                                            className="product-thumbnail"
                                        />
                                        <div>
                                            <h4>{product.name}</h4>
                                            <p>{product.sku}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>{product.category?.name}</td>
                                <td>
                                    <div>
                                        <span className="price">{formatPrice(product.price)}</span>
                                        {product.compareAtPrice && (
                                            <span className="compare-price">{formatPrice(product.compareAtPrice)}</span>
                                        )}
                                    </div>
                                </td>
                                <td>{product.stockQuantity}</td>
                                <td>
                                    <span className={`status-badge ${product.status}`}>
                                        {product.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="btn btn-small btn-edit"
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
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

            {filteredProducts.length === 0 && !loading && (
                <div className="no-products">
                    <p>No products found</p>
                    <button onClick={openModal} className="btn btn-primary">
                        Add Your First Product
                    </button>
                </div>
            )}

            {/* Add/Edit Product Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={closeModal} className="modal-close">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="product-form">
                            <div className="form-section">
                                <h3>Basic Information</h3>

                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Compare at Price</label>
                                        <input
                                            type="number"
                                            name="compareAtPrice"
                                            value={formData.compareAtPrice}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Cost Price</label>
                                        <input
                                            type="number"
                                            name="costPrice"
                                            value={formData.costPrice}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>SKU</label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Stock Quantity *</label>
                                        <input
                                            type="number"
                                            name="stockQuantity"
                                            value={formData.stockQuantity}
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <CategoryDropdown
                                            categories={categories}
                                            value={formData.category}
                                            onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                            placeholder="Select Category"
                                            required={true}
                                            disabled={loading}
                                            error={!formData.category && error ? 'Category is required' : null}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Brand</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Tags (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            placeholder="electronics, gadgets, tech"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="out_of_stock">Out of Stock</option>
                                            <option value="discontinued">Discontinued</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="featured"
                                                checked={formData.featured}
                                                onChange={handleInputChange}
                                            />
                                            Featured Product
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Product Images</h3>
                                <div className="image-upload-area">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        style={{ display: 'none' }}
                                    />

                                    <div className="upload-placeholder">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <p>Click to upload images or drag and drop</p>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="btn btn-secondary"
                                        >
                                            Choose Files
                                        </button>
                                    </div>

                                    {imageFiles.length > 0 && (
                                        <div className="image-preview-grid">
                                            {imageFiles.map((file, index) => (
                                                <div key={index} className="image-preview">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="remove-image"
                                                    >
                                                        ×
                                                    </button>
                                                    {uploadProgress[index] && (
                                                        <div className="upload-status">
                                                            {uploadProgress[index] === 'uploading' && <span>Uploading...</span>}
                                                            {uploadProgress[index] === 'completed' && <span>✓ Done</span>}
                                                            {uploadProgress[index] === 'error' && <span>✗ Failed</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={closeModal} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
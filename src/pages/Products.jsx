import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/allAPI';
import { formatPrice, getImageUrl } from '../services/commonAPI';
import { useCart } from '../contexts/CartContext';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        sort: '',
        minPrice: '',
        maxPrice: ''
    });
    const { addToCart, items: cartItems } = useCart();

    // Fetch products and categories on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [productsResponse, categoriesResponse] = await Promise.all([
                getProducts(),
                getCategories()
            ]);

            if (productsResponse && productsResponse.success) {
                setProducts(productsResponse.data);
            } else if (productsResponse && productsResponse.data) {
                // Fallback for API that returns data without success flag
                setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : []);
            }

            if (categoriesResponse && categoriesResponse.success) {
                setCategories(categoriesResponse.data);
            } else if (categoriesResponse && categoriesResponse.data) {
                // Fallback for API that returns data without success flag
                setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
            }
        } catch (err) {
            setError('Failed to fetch products');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await getProducts(filters);
            if (response && response.success) {
                setProducts(response.data);
                setError(null);
            } else if (response && response.data) {
                // Fallback for API that returns data without success flag
                setProducts(Array.isArray(response.data) ? response.data : []);
                setError(null);
            } else {
                setError('Failed to fetch products');
                setProducts([]);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to fetch products: ' + (err.message || 'Unknown error'));
            setProducts([]);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            sort: '',
            minPrice: '',
            maxPrice: ''
        });
    };

    const handleAddToCart = (product) => {
        // Pass the original product object to addToCart
        addToCart(product);

        // Show success feedback
        const button = document.querySelector(`[data-product-id="${product._id}"]`);
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            button.style.background = 'var(--success-color)';
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 2000);
        }

        console.log('Added to cart:', product.name);
    };

    if (loading) {
        return (
            <div className="products-page">
                <div className="container">
                    <div className="loading-spinner">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-page">
                <div className="container">
                    <div className="error-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        <p>{error}</p>
                        <button onClick={fetchData} className="retry-btn">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="products-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Our Products</h1>
                    <p>Discover our amazing collection of products</p>
                </div>

                {/* Filters Section */}
                <div className="filters-section">
                    <div className="filters-container">
                        <div className="filter-group">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <div className="filter-group">
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="category-select"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="sort-select"
                            >
                                <option value="">Sort By</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                                <option value="name-desc">Name: Z to A</option>
                                <option value="created-desc">Newest First</option>
                            </select>
                        </div>

                        <div className="filter-group price-filters">
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                className="price-input"
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="price-input"
                            />
                        </div>

                        <div className="filter-group">
                            <button onClick={clearFilters} className="clear-filters-btn">
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="products-section">
                    {products.length === 0 ? (
                        <div className="no-products">
                            <i className="fas fa-search"></i>
                            <h3>No products found</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map((product) => (
                                <div key={product._id} className="product-card">
                                    <Link to={`/products/${product._id}`} className="product-image-link">
                                        <div className="product-image">
                                            <img
                                                src={getImageUrl(product.images?.[0]?.url) || '/images/default-product.png'}
                                                alt={product.images?.[0]?.alt || product.name}
                                                onError={(e) => {
                                                    e.target.src = '/images/default-product.png';
                                                }}
                                            />
                                            {product.featured && (
                                                <span className="featured-badge">Featured</span>
                                            )}
                                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                <span className="sale-badge">
                                                    Sale
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    <div className="product-info">
                                        <Link to={`/products/${product._id}`} className="product-name-link">
                                            <h3 className="product-name">{product.name}</h3>
                                        </Link>
                                        <p className="product-brand">{product.brand}</p>
                                        <p className="product-category">
                                            {product.category?.name || 'Uncategorized'}
                                        </p>
                                        <p className="product-short-desc">{product.shortDescription}</p>

                                        <div className="product-pricing">
                                            <span className="current-price">{formatPrice(product.price)}</span>
                                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                                <span className="original-price">{formatPrice(product.compareAtPrice)}</span>
                                            )}
                                        </div>

                                        <div className="product-rating">
                                            {product.rating?.average > 0 && (
                                                <div className="stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i
                                                            key={i}
                                                            className={`fas fa-star ${i < Math.floor(product.rating.average) ? 'filled' : ''
                                                                }`}
                                                        ></i>
                                                    ))}
                                                    <span className="rating-text">
                                                        ({product.rating.count} reviews)
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="product-stock">
                                            {product.stockQuantity > 0 ? (
                                                <span className="in-stock">
                                                    <i className="fas fa-check"></i> In Stock ({product.stockQuantity})
                                                </span>
                                            ) : (
                                                <span className="out-of-stock">
                                                    <i className="fas fa-times"></i> Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        <div className="product-actions">
                                            <button
                                                className="add-to-cart-btn"
                                                disabled={product.stockQuantity === 0}
                                                onClick={() => handleAddToCart(product)}
                                                data-product-id={product._id}
                                            >
                                                <i className="fas fa-shopping-cart"></i>
                                                {cartItems.find(item => item.product._id === product._id) ? `Added (${cartItems.find(item => item.product._id === product._id).quantity})` : 'Add to Cart'}
                                            </button>
                                            <Link to={`/products/${product._id}`} className="view-details-btn">
                                                <i className="fas fa-eye"></i>
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results Summary */}
                {products.length > 0 && (
                    <div className="results-summary">
                        <p>
                            Showing {products.length} product{products.length !== 1 ? 's' : ''}
                            {filters.category && categories.find(c => c._id === filters.category) && (
                                <span> in {categories.find(c => c._id === filters.category)?.name}</span>
                            )}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
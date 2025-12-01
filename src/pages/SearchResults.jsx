import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaTh, FaList, FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { formatPrice } from '../services/commonAPI';
import './SearchResults.css';
import { useCart } from '../contexts/CartContext';

const SearchResults = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('relevance');
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
        rating: '',
        brand: ''
    });

    const searchQuery = searchParams.get('q') || '';

    const { addToCart } = useCart();

    useEffect(() => {
        if (searchQuery) {
            performSearch();
        }
    }, [searchQuery, sortBy, filters]);

    const performSearch = async () => {
        setLoading(true);
        try {
            // Simulate API call - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock search results
            const mockProducts = [
                {
                    id: '1',
                    name: 'Premium Wireless Headphones',
                    price: 199.99,
                    originalPrice: 249.99,
                    rating: 4.5,
                    reviews: 128,
                    image: '/images/headphones.jpg',
                    brand: 'AudioTech',
                    category: 'Electronics',
                    inStock: true,
                    onSale: true
                },
                {
                    id: '2',
                    name: 'Smart Fitness Watch',
                    price: 299.99,
                    rating: 4.2,
                    reviews: 89,
                    image: '/images/smartwatch.jpg',
                    brand: 'FitTech',
                    category: 'Electronics',
                    inStock: true,
                    onSale: false
                },
                {
                    id: '3',
                    name: 'Organic Cotton T-Shirt',
                    price: 29.99,
                    originalPrice: 39.99,
                    rating: 4.8,
                    reviews: 256,
                    image: '/images/tshirt.jpg',
                    brand: 'EcoWear',
                    category: 'Clothing',
                    inStock: true,
                    onSale: true
                }
            ];

            setProducts(mockProducts);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            priceRange: '',
            rating: '',
            brand: ''
        });
    };

    return (
        <div className="search-results">
            <div className="container">
                {/* Search Header */}
                <div className="search-header">
                    <div className="search-info">
                        <h1>Search Results</h1>
                        <p>Showing results for: <strong>"{searchQuery}"</strong></p>
                        <p className="results-count">{products.length} products found</p>
                    </div>
                    <div className="hero-image">
                        <img
                            src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1350&q=80"
                            alt="Search illustration"
                            className="page-hero-image"
                        />
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="search-controls">
                    <div className="filters-section">
                        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                            <FaFilter /> Filters
                        </button>

                        <div className={`filters-panel ${showFilters ? 'active' : ''}`}>
                            <div className="filter-group">
                                <label>Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="home">Home & Garden</option>
                                    <option value="sports">Sports</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Price Range</label>
                                <select
                                    value={filters.priceRange}
                                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                >
                                    <option value="">Any Price</option>
                                    <option value="0-50">$0 - $50</option>
                                    <option value="50-100">$50 - $100</option>
                                    <option value="100-200">$100 - $200</option>
                                    <option value="200+">$200+</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Rating</label>
                                <select
                                    value={filters.rating}
                                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                                >
                                    <option value="">Any Rating</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                    <option value="2">2+ Stars</option>
                                </select>
                            </div>

                            <button className="clear-filters" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    <div className="controls-section">
                        <div className="sort-section">
                            <label>Sort by:</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="relevance">Relevance</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>

                        <div className="view-mode">
                            <button
                                className={viewMode === 'grid' ? 'active' : ''}
                                onClick={() => setViewMode('grid')}
                            >
                                <FaTh />
                            </button>
                            <button
                                className={viewMode === 'list' ? 'active' : ''}
                                onClick={() => setViewMode('list')}
                            >
                                <FaList />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Searching products...</p>
                    </div>
                )}

                {/* Products Grid/List */}
                {!loading && (
                    <div className={`products-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
                        {products.length === 0 ? (
                            <div className="no-results">
                                <FaSearch className="no-results-icon" />
                                <h2>No products found</h2>
                                <p>Try adjusting your search terms or filters</p>
                                <div className="search-suggestions">
                                    <h3>Suggestions:</h3>
                                    <ul>
                                        <li>Check your spelling</li>
                                        <li>Use more general terms</li>
                                        <li>Try different keywords</li>
                                        <li>Remove some filters</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            products.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">
                                        <img src={product.image} alt={product.name} />
                                        {product.onSale && <span className="sale-badge">Sale</span>}
                                        <button className="wishlist-btn">
                                            <FaHeart />
                                        </button>
                                    </div>

                                    <div className="product-info">
                                        <Link to={`/products/${product.id}`} className="product-name">
                                            {product.name}
                                        </Link>

                                        <div className="product-brand">{product.brand}</div>

                                        <div className="product-rating">
                                            <div className="stars">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
                                                    />
                                                ))}
                                            </div>
                                            <span className="rating-text">({product.reviews} reviews)</span>
                                        </div>

                                        <div className="product-price">
                                            <span className="current-price">{formatPrice(product.price)}</span>
                                            {product.originalPrice && (
                                                <span className="original-price">{formatPrice(product.originalPrice)}</span>
                                            )}
                                        </div>

                                        <div className="product-actions">
                                            <button
                                                className="btn btn-primary add-to-cart"
                                                onClick={() => addToCart({ _id: product.id || product._id, name: product.name, price: product.price, image: product.image })}
                                            >
                                                <FaShoppingCart /> Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaShareAlt, FaTruck, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { getProduct } from '../services/allAPI';
import { formatPrice, getImageUrl } from '../services/commonAPI';
import { useCart } from '../contexts/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getProduct(id);

            if (response && response.success) {
                setProduct(response.data);
            } else if (response && response.data) {
                setProduct(response.data);
            } else {
                setError('Product not found');
            }
        } catch (err) {
            setError('Failed to load product details');
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Pass the original product object to addToCart
        addToCart(product);

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleQuantityChange = (value) => {
        const newQuantity = Math.max(1, value);
        setQuantity(newQuantity);
    };

    if (loading) {
        return (
            <div className="product-details-page">
                <div className="container">
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading product details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-details-page">
                <div className="container">
                    <div className="error-message">
                        <h2>{error || 'Product not found'}</h2>
                        <a href="/products" className="btn btn-primary">Back to Products</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-details-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <a href="/">Home</a>
                    <span>/</span>
                    <a href="/products">Products</a>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>

                {/* Product Details */}
                <div className="product-details-content">
                    {/* Product Images Section */}
                    <div className="product-images-section">
                        <div className="main-image">
                            <img
                                src={getImageUrl(product.images?.[selectedImage]?.url || product.images?.[0]?.url)}
                                alt={product.images?.[selectedImage]?.alt || product.name}
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1510557880182-3d4d3e3f3c57?auto=format&fit=crop&w=800&q=80';
                                }}
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {product.images && product.images.length > 1 && (
                            <div className="thumbnail-images">
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img
                                            src={getImageUrl(image.url)}
                                            alt={image.alt || `Product ${index + 1}`}
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1510557880182-3d4d3e3f3c57?auto=format&fit=crop&w=100&q=80';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div className="product-info-section">
                        {/* Header */}
                        <div className="product-header">
                            <h1>{product.name}</h1>
                            {product.brand && <p className="brand">{product.brand}</p>}
                        </div>

                        {/* Rating */}
                        <div className="rating-section">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < 4 ? 'filled' : 'empty'} />
                                ))}
                            </div>
                            <span className="rating-text">(128 reviews)</span>
                        </div>

                        {/* Price Section */}
                        <div className="price-section">
                            <div className="prices">
                                <span className="current-price">{formatPrice(product.price)}</span>
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <span className="original-price">{formatPrice(product.compareAtPrice)}</span>
                                )}
                            </div>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <span className="discount">
                                    {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="stock-status">
                            {product.stockQuantity > 0 ? (
                                <span className="in-stock">
                                    <FaCheckCircle /> In Stock ({product.stockQuantity} available)
                                </span>
                            ) : (
                                <span className="out-of-stock">Out of Stock</span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Product Details Grid */}
                        {(product.sku || product.weight || product.dimensions) && (
                            <div className="details-grid">
                                {product.sku && (
                                    <div className="detail-item">
                                        <span className="label">SKU:</span>
                                        <span className="value">{product.sku}</span>
                                    </div>
                                )}
                                {product.weight && (
                                    <div className="detail-item">
                                        <span className="label">Weight:</span>
                                        <span className="value">{product.weight.value} {product.weight.unit}</span>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="detail-item">
                                        <span className="label">Dimensions:</span>
                                        <span className="value">
                                            {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="colors-section">
                                <h4>Available Colors</h4>
                                <div className="color-options">
                                    {product.colors.map((color, index) => (
                                        <div key={index} className="color-option" title={color.name}>
                                            <div
                                                className="color-circle"
                                                style={{ backgroundColor: color.hexCode || '#ccc' }}
                                            />
                                            <span>{color.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="sizes-section">
                                <h4>Available Sizes</h4>
                                <div className="size-options">
                                    {product.sizes.map((size, index) => (
                                        <button key={index} className="size-btn">
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Section */}
                        <div className="cart-actions">
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <div className="quantity-control">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                        min="1"
                                    />
                                    <button onClick={() => handleQuantityChange(quantity + 1)}>
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                className={`btn btn-primary btn-add-cart ${addedToCart ? 'added' : ''}`}
                                onClick={handleAddToCart}
                                disabled={product.stockQuantity <= 0}
                            >
                                <FaShoppingCart />
                                <span>{addedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
                            </button>

                            <button className="btn btn-outline btn-wishlist">
                                <FaHeart />
                                <span>Add to Wishlist</span>
                            </button>
                        </div>

                        {/* Share */}
                        <button className="btn-share">
                            <FaShareAlt /> Share
                        </button>

                        {/* Trust Badges */}
                        <div className="trust-badges">
                            <div className="badge">
                                <FaTruck />
                                <span>Free Shipping on Orders Over $50</span>
                            </div>
                            <div className="badge">
                                <FaShieldAlt />
                                <span>Secure & Safe Checkout</span>
                            </div>
                            <div className="badge">
                                <FaCheckCircle />
                                <span>30-Day Money Back Guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
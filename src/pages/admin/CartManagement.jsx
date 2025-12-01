import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './CartManagement.css';

const CartManagement = () => {
    const { token } = useAuth();
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCart, setSelectedCart] = useState(null);
    const [showCartDetails, setShowCartDetails] = useState(false);

    // Fetch all carts
    const fetchCarts = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });

            const response = await fetch(`/api/cart/all?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setCarts(data.data.carts);
                setCurrentPage(data.pagination.page);
                setTotalPages(data.pagination.pages);
            } else {
                setError(data.message || 'Failed to fetch carts');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // View cart details
    const viewCartDetails = (cart) => {
        setSelectedCart(cart);
        setShowCartDetails(true);
    };

    // Close cart details modal
    const closeCartDetails = () => {
        setSelectedCart(null);
        setShowCartDetails(false);
    };

    useEffect(() => {
        fetchCarts();
    }, []);

    if (loading && carts.length === 0) {
        return (
            <div className="cart-management">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading carts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-management">
            <div className="cart-management-header">
                <h1>Cart Management</h1>
                <p>View all users' shopping carts and cart details</p>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setError(null)} className="close-btn">
                        ×
                    </button>
                </div>
            )}

            {/* Carts Summary */}
            <div className="carts-summary">
                <div className="summary-card">
                    <h3>Total Carts</h3>
                    <p className="summary-number">{carts.length}</p>
                </div>
                <div className="summary-card">
                    <h3>Active Carts</h3>
                    <p className="summary-number">
                        {carts.filter(cart => cart.totalItems > 0).length}
                    </p>
                </div>
                <div className="summary-card">
                    <h3>Empty Carts</h3>
                    <p className="summary-number">
                        {carts.filter(cart => cart.totalItems === 0).length}
                    </p>
                </div>
            </div>

            {/* Carts Table */}
            <div className="carts-table-container">
                <table className="carts-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Total Items</th>
                            <th>Total Price</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.map((cart) => (
                            <tr key={cart._id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {cart.user?.firstName?.[0]}{cart.user?.lastName?.[0]}
                                        </div>
                                        <div>
                                            <div className="user-name">
                                                {cart.user?.firstName} {cart.user?.lastName}
                                            </div>
                                            <div className="user-role">
                                                {cart.user?.role}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>{cart.user?.email}</td>
                                <td>
                                    <span className={`items-count ${cart.totalItems > 0 ? 'has-items' : 'empty'}`}>
                                        {cart.totalItems}
                                    </span>
                                </td>
                                <td className="price-cell">
                                    ${cart.totalPrice?.toFixed(2) || '0.00'}
                                </td>
                                <td>{new Date(cart.updatedAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => viewCartDetails(cart)}
                                        className="view-btn"
                                        disabled={loading}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {carts.length === 0 && !loading && (
                    <div className="no-carts">
                        <p>No carts found.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => fetchCarts(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="pagination-btn"
                    >
                        Previous
                    </button>

                    <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => fetchCarts(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}

            {loading && carts.length > 0 && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            {/* Cart Details Modal */}
            {showCartDetails && selectedCart && (
                <div className="cart-modal-overlay" onClick={closeCartDetails}>
                    <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cart-modal-header">
                            <h2>Cart Details</h2>
                            <button onClick={closeCartDetails} className="close-modal-btn">
                                ×
                            </button>
                        </div>

                        <div className="cart-modal-content">
                            {/* User Info */}
                            <div className="cart-user-info">
                                <h3>Customer Information</h3>
                                <div className="user-details">
                                    <p><strong>Name:</strong> {selectedCart.user?.firstName} {selectedCart.user?.lastName}</p>
                                    <p><strong>Email:</strong> {selectedCart.user?.email}</p>
                                    <p><strong>Role:</strong> {selectedCart.user?.role}</p>
                                </div>
                            </div>

                            {/* Cart Summary */}
                            <div className="cart-summary">
                                <h3>Cart Summary</h3>
                                <div className="summary-stats">
                                    <div className="stat">
                                        <span className="stat-label">Total Items:</span>
                                        <span className="stat-value">{selectedCart.totalItems}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Total Price:</span>
                                        <span className="stat-value">${selectedCart.totalPrice?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Created:</span>
                                        <span className="stat-value">{new Date(selectedCart.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Last Updated:</span>
                                        <span className="stat-value">{new Date(selectedCart.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className="cart-items">
                                <h3>Cart Items</h3>
                                {selectedCart.items && selectedCart.items.length > 0 ? (
                                    <div className="items-list">
                                        {selectedCart.items.map((item, index) => (
                                            <div key={index} className="cart-item">
                                                <div className="item-image">
                                                    {item.product?.images && item.product.images.length > 0 ? (
                                                        <img
                                                            src={item.product.images[0].url}
                                                            alt={item.product.name}
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-image.jpg';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="no-image">No Image</div>
                                                    )}
                                                </div>
                                                <div className="item-details">
                                                    <h4>{item.product?.name || 'Product Not Found'}</h4>
                                                    <p className="item-price">${item.product?.price?.toFixed(2) || '0.00'}</p>
                                                    <p className="item-quantity">Quantity: {item.quantity}</p>
                                                    <p className="item-total">Total: ${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-items">This cart is empty.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartManagement;
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaTruck, FaHome, FaPrint } from 'react-icons/fa';
import { formatPrice } from '../services/commonAPI';
import allAPI from '../services/allAPI';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(location.state?.order || null);
    const [loading, setLoading] = useState(!order);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!order && orderId) {
            fetchOrder();
        }
    }, [orderId, order]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await allAPI.getOrder(orderId);
            if (response?.success || response?.data) {
                setOrder(response.data);
            } else {
                setError('Could not fetch order details');
            }
        } catch (err) {
            setError('Failed to load order: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="confirmation-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading order details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="confirmation-page">
                <div className="container">
                    <div className="error-state">
                        <h2>Order Not Found</h2>
                        <p>{error || 'Your order could not be retrieved.'}</p>
                        <button onClick={() => navigate('/')} className="btn btn-primary">
                            <FaHome /> Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const totalAmount = order.totalPrice + (order.taxPrice || 0) + (order.shippingPrice || 0);

    return (
        <div className="confirmation-page">
            <div className="container">
                <div className="confirmation-container">
                    {/* Success Header */}
                    <div className="confirmation-header">
                        <FaCheckCircle className="success-icon" />
                        <h1>Order Confirmed!</h1>
                        <p>Thank you for your purchase. Your order has been successfully placed.</p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="confirmation-content">
                        {/* Left Column - Order Summary */}
                        <div className="confirmation-main">
                            {/* Order Info Card */}
                            <div className="info-card">
                                <h2>Order Information</h2>
                                <div className="info-row">
                                    <span className="label">Order ID</span>
                                    <span className="value">{order._id}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Order Date</span>
                                    <span className="value">{orderDate}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Payment Method</span>
                                    <span className="value">
                                        {order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' :
                                            order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' :
                                                order.paymentMethod === 'paypal' ? 'PayPal' : 'Credit Card'}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Status</span>
                                    <span className={`value status ${order.orderStatus || 'pending'}`}>
                                        {(order.orderStatus || 'pending').toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Shipping Address Card */}
                            <div className="info-card">
                                <h2><FaTruck /> Shipping Address</h2>
                                <div className="address-block">
                                    <p className="address-line">
                                        {order.shippingAddress.street}
                                    </p>
                                    <p className="address-line">
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                    </p>
                                    <p className="address-line">
                                        {order.shippingAddress.country}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items Card */}
                            <div className="info-card">
                                <h2><FaBox /> Order Items</h2>
                                <div className="items-list">
                                    {order.orderItems && order.orderItems.map((item, index) => (
                                        <div key={index} className="item-row">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1510557880182-3d4d3e3f3c57?auto=format&fit=crop&w=100&q=80";
                                                    }}
                                                />
                                            )}
                                            <div className="item-details">
                                                <p className="item-name">{item.name}</p>
                                                <p className="item-qty">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* What's Next */}
                            <div className="info-card whats-next">
                                <h2>What's Next?</h2>
                                <div className="steps">
                                    <div className="step">
                                        <div className="step-number">1</div>
                                        <div className="step-content">
                                            <p className="step-title">Order Confirmation</p>
                                            <p className="step-desc">Check your email for the order confirmation</p>
                                        </div>
                                    </div>
                                    <div className="step">
                                        <div className="step-number">2</div>
                                        <div className="step-content">
                                            <p className="step-title">Processing</p>
                                            <p className="step-desc">We're preparing your order for shipment</p>
                                        </div>
                                    </div>
                                    <div className="step">
                                        <div className="step-number">3</div>
                                        <div className="step-content">
                                            <p className="step-title">Shipped</p>
                                            <p className="step-desc">Track your package in real-time</p>
                                        </div>
                                    </div>
                                    <div className="step">
                                        <div className="step-number">4</div>
                                        <div className="step-content">
                                            <p className="step-title">Delivered</p>
                                            <p className="step-desc">Receive your order at your doorstep</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Summary Sidebar */}
                        <div className="confirmation-sidebar">
                            <div className="summary-card">
                                <h3>Order Summary</h3>

                                <div className="summary-details">
                                    <div className="detail-row">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(order.totalPrice)}</span>
                                    </div>
                                    {order.taxPrice > 0 && (
                                        <div className="detail-row">
                                            <span>Tax</span>
                                            <span>{formatPrice(order.taxPrice)}</span>
                                        </div>
                                    )}
                                    {order.shippingPrice > 0 && (
                                        <div className="detail-row">
                                            <span>Shipping</span>
                                            <span>{formatPrice(order.shippingPrice)}</span>
                                        </div>
                                    )}
                                    {order.shippingPrice === 0 && (
                                        <div className="detail-row">
                                            <span>Shipping</span>
                                            <span className="free">FREE</span>
                                        </div>
                                    )}
                                    <div className="detail-row total">
                                        <span>Total</span>
                                        <span>{formatPrice(totalAmount)}</span>
                                    </div>
                                </div>

                                <div className="actions">
                                    <button onClick={handlePrint} className="btn btn-outline btn-small">
                                        <FaPrint /> Print Receipt
                                    </button>
                                </div>
                            </div>

                            <div className="support-card">
                                <h4>Need Help?</h4>
                                <p>If you have any questions about your order, please contact our support team.</p>
                                <a href="/contact-us" className="btn btn-outline btn-small btn-full">
                                    Contact Support
                                </a>
                            </div>

                            <div className="trust-badges">
                                <p>✓ Secure Transaction</p>
                                <p>✓ 30-Day Return Policy</p>
                                <p>✓ Free Shipping Over $100</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="confirmation-actions">
                        <button onClick={() => navigate('/')} className="btn btn-outline">
                            <FaHome /> Continue Shopping
                        </button>
                        <button onClick={() => navigate('/order-history')} className="btn btn-primary">
                            View My Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;

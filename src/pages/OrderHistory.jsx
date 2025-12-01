import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTruck, FaBox, FaArrowRight } from 'react-icons/fa';
import { formatPrice } from '../services/commonAPI';
import allAPI from '../services/allAPI';
import './OrderHistory.css';

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await allAPI.getOrders();

            if (response?.success || (Array.isArray(response?.data))) {
                const orderData = Array.isArray(response) ? response : (response?.data || []);
                setOrders(orderData);
            } else {
                setOrders([]);
            }
        } catch (err) {
            setError('Failed to load orders');
            console.error('Error fetching orders:', err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClass = status || 'pending';
        const statusText = statusClass.charAt(0).toUpperCase() + statusClass.slice(1);
        return { class: statusClass, text: statusText };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredOrders = selectedStatus === 'all'
        ? orders
        : orders.filter(order => (order.orderStatus || 'pending') === selectedStatus);

    if (loading) {
        return (
            <div className="order-history-page">
                <div className="container">
                    <div className="order-history-header">
                        <h1>Order History</h1>
                        <p>Track and manage all your previous orders</p>
                    </div>
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-history-page">
                <div className="container">
                    <div className="order-history-header">
                        <h1>Order History</h1>
                        <p>Track and manage all your previous orders</p>
                    </div>
                    <div className="error-state">
                        <p>{error}</p>
                        <button onClick={fetchOrders} className="btn btn-primary">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="order-history-page">
                <div className="container">
                    <div className="order-history-header">
                        <h1>Order History</h1>
                        <p>Track and manage all your previous orders</p>
                    </div>

                    <div className="order-history-content">
                        <FaClock className="order-history-icon" />
                        <h2>No Orders Yet</h2>
                        <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>

                        <div className="order-history-features">
                            <div className="feature-card">
                                <FaCheckCircle className="feature-icon" />
                                <h3>Order Tracking</h3>
                                <p>Real-time updates on your order status and delivery progress</p>
                            </div>
                            <div className="feature-card">
                                <FaTruck className="feature-icon" />
                                <h3>Fast Delivery</h3>
                                <p>Quick and reliable shipping options to get your items fast</p>
                            </div>
                            <div className="feature-card">
                                <FaBox className="feature-icon" />
                                <h3>Easy Reordering</h3>
                                <p>Quickly reorder your favorite products with just one click</p>
                            </div>
                        </div>

                        <button onClick={() => navigate('/products')} className="btn btn-primary">
                            Start Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-history-page">
            <div className="container">
                <div className="order-history-header">
                    <h1>Order History</h1>
                    <p>You have {orders.length} order{orders.length !== 1 ? 's' : ''}</p>
                </div>

                <div className="order-history-content">
                    {/* Status Filter */}
                    <div className="status-filter">
                        <button
                            className={`filter-btn ${selectedStatus === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('all')}
                        >
                            All Orders ({orders.length})
                        </button>
                        <button
                            className={`filter-btn ${selectedStatus === 'pending' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('pending')}
                        >
                            Pending ({orders.filter(o => (o.orderStatus || 'pending') === 'pending').length})
                        </button>
                        <button
                            className={`filter-btn ${selectedStatus === 'processing' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('processing')}
                        >
                            Processing ({orders.filter(o => (o.orderStatus || 'pending') === 'processing').length})
                        </button>
                        <button
                            className={`filter-btn ${selectedStatus === 'shipped' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('shipped')}
                        >
                            Shipped ({orders.filter(o => (o.orderStatus || 'pending') === 'shipped').length})
                        </button>
                        <button
                            className={`filter-btn ${selectedStatus === 'delivered' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('delivered')}
                        >
                            Delivered ({orders.filter(o => (o.orderStatus || 'pending') === 'delivered').length})
                        </button>
                    </div>

                    {/* Orders List */}
                    <div className="orders-list">
                        {filteredOrders.length === 0 ? (
                            <div className="no-results">
                                <p>No orders found with status: {selectedStatus}</p>
                            </div>
                        ) : (
                            filteredOrders.map((order) => {
                                const statusInfo = getStatusBadge(order.orderStatus);
                                const totalAmount = order.totalPrice + (order.taxPrice || 0) + (order.shippingPrice || 0);

                                return (
                                    <div key={order._id} className="order-card">
                                        <div className="order-header">
                                            <div className="order-info">
                                                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                                                <p className="order-date">{formatDate(order.createdAt)}</p>
                                            </div>
                                            <span className={`status-badge ${statusInfo.class}`}>
                                                {statusInfo.text}
                                            </span>
                                        </div>

                                        <div className="order-items">
                                            {order.orderItems && order.orderItems.slice(0, 3).map((item, index) => (
                                                <div key={index} className="order-item">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            onError={(e) => {
                                                                e.target.src = "https://images.unsplash.com/photo-1510557880182-3d4d3e3f3c57?auto=format&fit=crop&w=80&q=80";
                                                            }}
                                                        />
                                                    )}
                                                    <div className="item-info">
                                                        <p className="item-name">{item.name}</p>
                                                        <p className="item-qty">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.orderItems && order.orderItems.length > 3 && (
                                                <div className="more-items">
                                                    +{order.orderItems.length - 3} more
                                                </div>
                                            )}
                                        </div>

                                        <div className="order-footer">
                                            <div className="order-total">
                                                <span className="label">Total:</span>
                                                <span className="amount">{formatPrice(totalAmount)}</span>
                                            </div>
                                            <button
                                                className="btn btn-outline btn-small"
                                                onClick={() => navigate(`/order-confirmation/${order._id}`, { state: { order } })}
                                            >
                                                View Details <FaArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
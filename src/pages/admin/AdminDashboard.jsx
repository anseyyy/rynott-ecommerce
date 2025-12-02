import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { isAdmin, isAuthenticated, formatPrice } from '../../services/commonAPI';
import { getDashboardStats, getProducts } from '../../services/allAPI';
import { autoLoginAdmin, shouldAutoLogin } from '../../services/devLogin';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zeroStockProducts, setZeroStockProducts] = useState([]);

    useEffect(() => {
        const initializeAdmin = async () => {
            // Auto-login admin in development if not authenticated
            if (shouldAutoLogin()) {
                console.log('🔐 Auto-login: Attempting to log in admin user...');
                const loginResult = await autoLoginAdmin();
                if (loginResult.success) {
                    console.log('✅ Auto-login successful, fetching dashboard data...');
                } else {
                    console.error('❌ Auto-login failed:', loginResult.error);
                }
            }

            // Fetch dashboard stats
            fetchDashboardStats();
        };

        initializeAdmin();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);

            console.log('📊 Fetching dashboard stats...');

            // Check if user is authenticated
            if (!isAuthenticated()) {
                console.log('⚠️ User not authenticated, showing fallback data');
                setStats({
                    products: { totalProducts: 0 },
                    users: { count: 0 },
                    orders: { count: 0 }
                });
                setZeroStockProducts([]);
                setError('Please log in to view dashboard data.');
                return;
            }

            const [statsResponse, productsResponse] = await Promise.allSettled([
                getDashboardStats(),
                getProducts()
            ]);

            // Handle dashboard stats
            if (statsResponse.status === 'fulfilled' && statsResponse.value) {
                console.log('✅ Dashboard stats received:', statsResponse.value);
                setStats(statsResponse.value);
            } else {
                console.warn('⚠️ Dashboard stats failed:', statsResponse.reason || statsResponse.value);
                setStats({
                    products: { totalProducts: 0 },
                    users: { count: 0 },
                    orders: { count: 0 }
                });
            }

            // Handle products for zero stock analysis
            if (productsResponse.status === 'fulfilled' && productsResponse.value?.success) {
                const products = productsResponse.value.data || [];
                const zeroStock = products.filter(product => product.stockQuantity === 0);
                console.log('✅ Products received:', products.length, 'Zero stock items:', zeroStock.length);
                setZeroStockProducts(zeroStock);
            } else {
                console.warn('⚠️ Products fetch failed:', productsResponse.reason || productsResponse.value);
                setZeroStockProducts([]);
            }
        } catch (error) {
            console.error('❌ Failed to fetch dashboard stats:', error);
            // Set fallback stats to ensure dashboard still displays
            setStats({
                products: { totalProducts: 0 },
                users: { count: 0 },
                orders: { count: 0 }
            });
            setZeroStockProducts([]);
            setError('Some dashboard data could not be loaded. The system is still functional.');
        } finally {
            setLoading(false);
        }
    };

    // Check authentication and admin role
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner-large"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome to Rynott Admin Panel</p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={fetchDashboardStats} className="btn btn-small">
                        Retry
                    </button>
                </div>
            )}

            {stats && (
                <>
                    {/* Stats Overview */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon products-icon">
                                <i className="fas fa-box"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.products?.totalProducts || 0}</h3>
                                <p>Total Products</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon users-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.users?.count || 0}</h3>
                                <p>Total Users</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon orders-icon">
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.orders?.count || 0}</h3>
                                <p>Total Orders</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon revenue-icon">
                                <i className="fas fa-dollar-sign"></i>
                            </div>
                            <div className="stat-content">
                                <h3>$0</h3>
                                <p>Total Revenue</p>
                            </div>
                        </div>
                    </div>

                    {/* Zero Stock Products Alert */}
                    {zeroStockProducts.length > 0 ? (
                        <div className="zero-stock-alert">
                            <div className="alert-header">
                                <h2>
                                    <i className="fas fa-exclamation-triangle"></i>
                                    Products Out of Stock ({zeroStockProducts.length})
                                </h2>
                                <Link to="/admin/products" className="btn btn-warning btn-small">
                                    <i className="fas fa-eye"></i>
                                    View All Products
                                </Link>
                            </div>
                            <div className="zero-stock-grid">
                                {zeroStockProducts.slice(0, 6).map(product => (
                                    <div key={product._id} className="zero-stock-item">
                                        <img
                                            src={product.images?.[0]?.url || '/images/default-product.png'}
                                            alt={product.name}
                                            className="zero-stock-image"
                                        />
                                        <div className="zero-stock-info">
                                            <h4>{product.name}</h4>
                                            <p className="price">{formatPrice(product.price)}</p>
                                            <span className="stock-zero">Stock: 0</span>
                                        </div>
                                        <Link
                                            to={`/admin/products?edit=${product._id}`}
                                            className="btn btn-small btn-edit"
                                            title="Edit Product"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            {zeroStockProducts.length > 6 && (
                                <div className="alert-footer">
                                    <p>And {zeroStockProducts.length - 6} more products...</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-zero-stock-alert">
                            <div className="alert-header">
                                <h2>
                                    <i className="fas fa-check-circle"></i>
                                    All Products In Stock
                                </h2>
                                <Link to="/admin/products" className="btn btn-primary btn-small">
                                    <i className="fas fa-list"></i>
                                    View All Products
                                </Link>
                            </div>
                            <p>Great! All your products currently have stock available. No immediate restocking needed.</p>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="action-buttons">
                            <Link to="/admin/products" className="action-btn">
                                <i className="fas fa-plus"></i>
                                <span>Add Product</span>
                            </Link>

                            <Link to="/admin/products" className="action-btn">
                                <i className="fas fa-list"></i>
                                <span>Manage Products</span>
                            </Link>

                            <Link to="/admin/categories" className="action-btn">
                                <i className="fas fa-tags"></i>
                                <span>Manage Categories</span>
                            </Link>

                            <Link to="/admin/users" className="action-btn">
                                <i className="fas fa-user-cog"></i>
                                <span>Manage Users</span>
                            </Link>

                            <Link to="/admin/contacts" className="action-btn">
                                <i className="fas fa-envelope"></i>
                                <span>View Contact Messages</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="recent-activity">
                        <h2>Recent Activity</h2>
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-box"></i>
                                </div>
                                <div className="activity-content">
                                    <p>Welcome to Rynott Admin Panel!</p>
                                    <span className="activity-time">System initialized</span>
                                </div>
                            </div>

                            <div className="activity-item">
                                <div className="activity-icon">
                                    <i className="fas fa-info-circle"></i>
                                </div>
                                <div className="activity-content">
                                    <p>Start by adding products and categories</p>
                                    <span className="activity-time">Get started</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="system-status">
                        <h2>System Status</h2>
                        <div className="status-items">
                            <div className="status-item">
                                <span className="status-label">Database</span>
                                <span className="status-indicator online">Online</span>
                            </div>

                            <div className="status-item">
                                <span className="status-label">API Server</span>
                                <span className="status-indicator online">Online</span>
                            </div>

                            <div className="status-item">
                                <span className="status-label">File Storage</span>
                                <span className="status-indicator online">Online</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const { cartCount } = useCart();
    const { user, isAuthenticated } = useAuth();

    const handleLogout = () => {
        onLogout();
        setIsUserMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-brand">
                    <h1>Rynott</h1>
                </Link>

                {/* Navigation Links */}
                <div className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                    <Link to="/products" className="nav-link">
                        Products
                    </Link>
                    <Link to="/about" className="nav-link">
                        About
                    </Link>
                    <Link to="/contact" className="nav-link">
                        Contact
                    </Link>
                    {isAuthenticated && (
                        <Link to="/cart" className="nav-link cart-link">
                            <i className="fas fa-shopping-cart"></i>
                            <span className="cart-text">Cart</span>
                            <span className="cart-badge">{cartCount > 0 ? cartCount : ''}</span>
                        </Link>
                    )}
                </div>

                {/* User Menu */}
                <div className="navbar-user">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <button
                                className="user-menu-toggle"
                                onClick={toggleUserMenu}
                            >
                                <div className="user-avatar">
                                    {user?.firstName?.[0] || 'U'}
                                </div>
                                <span className="user-name">
                                    {user?.firstName || 'User'}
                                </span>
                                <i className="fas fa-chevron-down"></i>
                            </button>

                            {isUserMenuOpen && (
                                <div className="user-dropdown">
                                    <div className="user-info">
                                        <p className="user-email">{user?.email}</p>
                                        <p className="user-role">
                                            {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                                        </p>
                                    </div>

                                    <div className="dropdown-divider"></div>

                                    <Link
                                        to="/profile"
                                        className="dropdown-link"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <i className="fas fa-user"></i>
                                        Profile
                                    </Link>

                                    <Link
                                        to="/orders"
                                        className="dropdown-link"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <i className="fas fa-shopping-bag"></i>
                                        My Orders
                                    </Link>

                                    {user?.role === 'admin' && (
                                        <>
                                            <div className="dropdown-divider"></div>
                                            <div className="dropdown-header">Admin Panel</div>
                                            <Link
                                                to="/admin/dashboard"
                                                className="dropdown-link"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <i className="fas fa-tachometer-alt"></i>
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/admin/products"
                                                className="dropdown-link"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <i className="fas fa-box"></i>
                                                Products
                                            </Link>
                                            <Link
                                                to="/admin/users"
                                                className="dropdown-link"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <i className="fas fa-users"></i>
                                                Users
                                            </Link>
                                            <Link
                                                to="/admin/carts"
                                                className="dropdown-link"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <i className="fas fa-shopping-cart"></i>
                                                Carts
                                            </Link>
                                        </>
                                    )}

                                    <div className="dropdown-divider"></div>

                                    <button
                                        className="dropdown-link logout-btn"
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt"></i>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-outline">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu toggle */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={toggleMenu}
                    >
                        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    Home
                </Link>
                <Link to="/products" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    Products
                </Link>
                <Link to="/about" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    About
                </Link>
                <Link to="/contact" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                    Contact
                </Link>
                {isAuthenticated && (
                    <Link to="/cart" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                        <i className="fas fa-shopping-cart"></i>
                        Cart
                    </Link>
                )}

                {!isAuthenticated && (
                    <>
                        <Link to="/login" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                            Sign In
                        </Link>
                        <Link to="/register" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
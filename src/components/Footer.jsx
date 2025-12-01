import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Rynott</h3>
                    <p>Your trusted partner for quality products worldwide. Discover amazing deals and unique items on our international ecommerce platform.</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/products">Products</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Customer Service</h4>
                    <ul>
                        <li><a href="/help">Help Center</a></li>
                        <li><a href="/shipping">Shipping Info</a></li>
                        <li><a href="/returns">Returns</a></li>
                        <li><a href="/track">Order Tracking</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Connect With Us</h4>
                    <div className="social-links">
                        <a href="#" className="social-link">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="#" className="social-link">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="social-link">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="social-link">
                            <i className="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-container">
                    <p>&copy; 2024 Rynott. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
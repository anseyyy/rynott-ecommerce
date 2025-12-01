import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaShippingFast, FaShieldAlt, FaStar, FaHeadset, FaLaptop, FaTshirt, FaHome, FaFootballBall, FaArrowRight, FaCheckCircle, FaUsers, FaTag } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome to <span className="gradient-text">Rynott</span>
              </h1>
              <p className="hero-subtitle">
                Your ultimate destination for quality products and an exceptional shopping experience.
                Discover amazing deals from trusted brands worldwide.
              </p>

              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Happy Customers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Products</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">99%</div>
                  <div className="stat-label">Satisfaction</div>
                </div>
              </div>

              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary btn-large">
                  <FaShoppingBag /> Shop Now
                </Link>
                <Link to="/register" className="btn btn-outline btn-large">
                  <FaUsers /> Create Account
                </Link>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1350&q=80"
                  alt="Shopping bags and products"
                  className="page-hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Rynott?</h2>
            <p>We provide the best shopping experience with premium features</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaShippingFast />
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping to your doorstep within 2–3 days</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Secure Shopping</h3>
              <p>Your data and payments are always protected with bank‑level security</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3>Quality Products</h3>
              <p>Carefully curated products from trusted and verified sellers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaHeadset />
              </div>
              <h3>24/7 Support</h3>
              <p>Our customer service team is always here to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore our wide range of product categories</p>
          </div>
          <div className="categories-grid">
            <Link to="/products?category=electronics" className="category-card">
              <div className="category-icon">
                <FaLaptop />
              </div>
              <h3>Electronics</h3>
              <p>Latest gadgets and tech</p>
            </Link>
            <Link to="/products?category=clothing" className="category-card">
              <div className="category-icon">
                <FaTshirt />
              </div>
              <h3>Clothing</h3>
              <p>Fashion for everyone</p>
            </Link>
            <Link to="/products?category=home" className="category-card">
              <div className="category-icon">
                <FaHome />
              </div>
              <h3>Home & Garden</h3>
              <p>Everything for your home</p>
            </Link>
            <Link to="/products?category=sports" className="category-card">
              <div className="category-icon">
                <FaFootballBall />
              </div>
              <h3>Sports</h3>
              <p>Active lifestyle gear</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Shopping Benefits</h2>
            <p>Enjoy these exclusive benefits when you shop with us</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaCheckCircle />
              </div>
              <h3>Quality Guarantee</h3>
              <p>30‑day money‑back guarantee on all products</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaTag />
              </div>
              <h3>Best Prices</h3>
              <p>Competitive pricing with regular deals and discounts</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaUsers />
              </div>
              <h3>Trusted Community</h3>
              <p>Join thousands of satisfied customers worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Shopping?</h2>
            <p>Join thousands of satisfied customers and discover amazing products today!</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started <FaArrowRight />
              </Link>
              <Link to="/products" className="btn btn-outline btn-large">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

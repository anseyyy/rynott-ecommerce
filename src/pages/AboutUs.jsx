import React from 'react';
import { FaUsers, FaHeart, FaAward, FaGlobe, FaRocket, FaLeaf } from 'react-icons/fa';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-us">
            {/* Hero Section */}
            <div className="about-hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>About Rynott</h1>
                        <p className="hero-subtitle">
                            Your trusted partner in ecommerce excellence since 2020.
                            We're passionate about connecting quality products with customers worldwide.
                        </p>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Happy Customers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Products Available</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">99%</div>
                            <div className="stat-label">Customer Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="our-story">
                <div className="container">
                    <div className="story-content">
                        <div className="story-text">
                            <h2>Our Story</h2>
                            <p>
                                Rynott was founded in 2020 with a simple yet ambitious vision: to create
                                an ecommerce platform that truly puts customers first. What started as a
                                small startup has grown into a trusted marketplace serving thousands of
                                satisfied customers worldwide.
                            </p>
                            <p>
                                Our founders, passionate about technology and customer service, recognized
                                the need for an ecommerce platform that combined quality products with
                                exceptional user experience. Today, we continue to innovate and expand,
                                always keeping our customers at the heart of everything we do.
                            </p>
                            <p>
                                At Rynott, we believe shopping should be more than just a transaction –
                                it should be an experience that delights, inspires, and connects people
                                with products that enhance their lives.
                            </p>
                        </div>
                        <div className="story-image">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1350&q=80"
                                alt="Our team at Rynott"
                                className="page-hero-image"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Values Section */}
            <div className="our-values">
                <div className="container">
                    <h2 className="section-title">Our Values</h2>
                    <p className="section-subtitle">
                        The principles that guide everything we do at Rynott
                    </p>

                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">
                                <FaHeart />
                            </div>
                            <h3>Customer First</h3>
                            <p>
                                Every decision we make starts with our customers. We're committed to
                                providing exceptional service and building lasting relationships.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <FaAward />
                            </div>
                            <h3>Quality Excellence</h3>
                            <p>
                                We carefully curate our product selection to ensure every item meets
                                our high standards for quality, durability, and value.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <FaGlobe />
                            </div>
                            <h3>Global Reach</h3>
                            <p>
                                Connecting customers worldwide with products from trusted sellers
                                across the globe, making quality goods accessible to everyone.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <FaRocket />
                            </div>
                            <h3>Innovation</h3>
                            <p>
                                Continuously improving our platform and processes to deliver the
                                best possible shopping experience for our customers.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <FaLeaf />
                            </div>
                            <h3>Sustainability</h3>
                            <p>
                                Committed to responsible business practices and supporting
                                sustainable products that are better for our planet.
                            </p>
                        </div>

                        <div className="value-card">
                            <div className="value-icon">
                                <FaUsers />
                            </div>
                            <h3>Community</h3>
                            <p>
                                Building a supportive community where customers, sellers, and
                                our team work together for mutual success.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="our-team">
                <div className="container">
                    <h2 className="section-title">Meet Our Team</h2>
                    <p className="section-subtitle">
                        The passionate people behind Rynott's success
                    </p>

                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-photo">
                                <div className="photo-placeholder">
                                    <span>JD</span>
                                </div>
                            </div>
                            <div className="member-info">
                                <h3>John Doe</h3>
                                <p className="member-role">Founder & CEO</p>
                                <p className="member-bio">
                                    With over 15 years of experience in ecommerce and technology,
                                    John leads our vision for customer-centric innovation.
                                </p>
                            </div>
                        </div>

                        <div className="team-member">
                            <div className="member-photo">
                                <div className="photo-placeholder">
                                    <span>SM</span>
                                </div>
                            </div>
                            <div className="member-info">
                                <h3>Sarah Martinez</h3>
                                <p className="member-role">Head of Customer Experience</p>
                                <p className="member-bio">
                                    Sarah ensures every customer interaction exceeds expectations
                                    and drives our commitment to exceptional service.
                                </p>
                            </div>
                        </div>

                        <div className="team-member">
                            <div className="member-photo">
                                <div className="photo-placeholder">
                                    <span>MC</span>
                                </div>
                            </div>
                            <div className="member-info">
                                <h3>Michael Chen</h3>
                                <p className="member-role">Chief Technology Officer</p>
                                <p className="member-bio">
                                    Michael leads our technical innovations, ensuring our platform
                                    remains cutting-edge and user-friendly.
                                </p>
                            </div>
                        </div>

                        <div className="team-member">
                            <div className="member-photo">
                                <div className="photo-placeholder">
                                    <span>EL</span>
                                </div>
                            </div>
                            <div className="member-info">
                                <h3>Emily Liu</h3>
                                <p className="member-role">Head of Partnerships</p>
                                <p className="member-bio">
                                    Emily builds and maintains relationships with our trusted
                                    suppliers and brand partners worldwide.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="mission-vision">
                <div className="container">
                    <div className="mv-grid">
                        <div className="mv-card mission">
                            <div className="mv-icon">
                                <FaRocket />
                            </div>
                            <h2>Our Mission</h2>
                            <p>
                                To create the world's most customer-centric ecommerce platform,
                                making quality products accessible to everyone while delivering
                                exceptional value and service.
                            </p>
                        </div>

                        <div className="mv-card vision">
                            <div className="mv-icon">
                                <FaGlobe />
                            </div>
                            <h2>Our Vision</h2>
                            <p>
                                To be the global leader in ecommerce innovation, connecting
                                millions of customers with products that enhance their lives
                                through technology and trust.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="our-journey">
                <div className="container">
                    <h2 className="section-title">Our Journey</h2>
                    <p className="section-subtitle">
                        Key milestones in Rynott's growth story
                    </p>

                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-year">2020</div>
                            <div className="timeline-content">
                                <h3>The Beginning</h3>
                                <p>Rynott was founded with a vision to revolutionize online shopping.</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-year">2021</div>
                            <div className="timeline-content">
                                <h3>First 10K Customers</h3>
                                <p>Reached our first major milestone of serving 10,000 satisfied customers.</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-year">2022</div>
                            <div className="timeline-content">
                                <h3>International Expansion</h3>
                                <p>Expanded operations to serve customers across multiple countries.</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-year">2023</div>
                            <div className="timeline-content">
                                <h3>Technology Innovation</h3>
                                <p>Launched our mobile app and advanced AI-powered recommendation system.</p>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-year">2024</div>
                            <div className="timeline-content">
                                <h3>50K+ Happy Customers</h3>
                                <p>Celebrating our growth to serving over 50,000 customers worldwide.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Join the Rynott Family?</h2>
                        <p>Experience the difference that customer-first ecommerce makes.</p>
                        <div className="cta-buttons">
                            <a href="/products" className="btn btn-primary">Shop Now</a>
                            <a href="/contact" className="btn btn-outline">Get in Touch</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
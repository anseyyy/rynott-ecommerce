import React from 'react';
import { FaFileContract, FaGavel, FaShieldAlt, FaHandshake } from 'react-icons/fa';
import './TermsOfService.css';

const TermsOfService = () => {
    return (
        <div className="terms-of-service">
            <div className="terms-hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-icon">
                            <FaFileContract />
                        </div>
                        <h1>Terms of Service</h1>
                        <div className="hero-image">
                            <img
                                src="https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1350&q=80"
                                alt="Terms document"
                                className="page-hero-image"
                            />
                        </div>
                        <p>Please read these terms carefully before using our services.</p>
                        <p className="last-updated">Last updated: December 1, 2024</p>
                    </div>
                </div>
            </div>

            <div className="terms-content">
                <div className="container">
                    <div className="content-wrapper">
                        {/* Introduction */}
                        <section className="terms-section">
                            <h2><FaHandshake className="section-icon" /> Introduction</h2>
                            <p>
                                Welcome to Rynott. These Terms of Service ("Terms") govern your use of our website, mobile application, and services (collectively, the "Services") operated by Rynott ("us", "we", or "our").
                            </p>
                            <p>
                                By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Services.
                            </p>
                        </section>

                        {/* Acceptance of Terms */}
                        <section className="terms-section">
                            <h2><FaGavel className="section-icon" /> Acceptance of Terms</h2>
                            <p>
                                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                            </p>
                            <p>
                                These Terms constitute the entire agreement between you and Rynott regarding the use of our Services. We reserve the right to modify these Terms at any time without prior notice.
                            </p>
                        </section>

                        {/* Use License */}
                        <section className="terms-section">
                            <h2><FaShieldAlt className="section-icon" /> Use License</h2>
                            <p>Permission is granted to temporarily download one copy of the materials on Rynott's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>

                            <h3>Prohibited Uses</h3>
                            <ul>
                                <li>Modify or copy the materials</li>
                                <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                                <li>Attempt to reverse engineer any software contained on the website</li>
                                <li>Remove any copyright or other proprietary notations from the materials</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                            </ul>

                            <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Rynott at any time.</p>
                        </section>

                        {/* Account Registration */}
                        <section className="terms-section">
                            <h2>Account Registration</h2>
                            <p>To access certain features of our Services, you must register for an account. When you register:</p>
                            <ul>
                                <li>You must provide accurate, complete, and current information</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                                <li>You are responsible for all activities that occur under your account</li>
                                <li>You must notify us immediately of any unauthorized use of your account</li>
                                <li>You must be at least 18 years old to create an account</li>
                            </ul>
                        </section>

                        {/* Product Information */}
                        <section className="terms-section">
                            <h2>Product Information and Pricing</h2>
                            <p>We strive to provide accurate product descriptions, pricing, and availability information. However:</p>

                            <h3>Product Descriptions</h3>
                            <ul>
                                <li>We make every effort to ensure product descriptions are accurate</li>
                                <li>Colors may vary due to monitor settings and photography</li>
                                <li>Specifications and features are subject to change without notice</li>
                            </ul>

                            <h3>Pricing</h3>
                            <ul>
                                <li>All prices are subject to change without notice</li>
                                <li> Prices are quoted in USD and include applicable taxes unless otherwise specified</li>
                                <li>Special offers and promotions have specific terms and conditions</li>
                                <li>We reserve the right to correct any pricing errors</li>
                            </ul>
                        </section>

                        {/* Orders and Payments */}
                        <section className="terms-section">
                            <h2>Orders and Payments</h2>

                            <h3>Order Acceptance</h3>
                            <p>Your receipt of an order confirmation does not signify our acceptance of your order. We reserve the right to cancel any order for any reason at any time after receipt of your order.</p>

                            <h3>Payment Methods</h3>
                            <ul>
                                <li>We accept major credit cards and other payment methods as displayed</li>
                                <li>Payment must be received in full before shipping</li>
                                <li>We use secure payment processing to protect your financial information</li>
                                <li>All prices are subject to change without notice</li>
                            </ul>

                            <h3>Order Changes and Cancellations</h3>
                            <p>You may modify or cancel your order within 1 hour of placement, subject to our processing status. Once an order has been processed or shipped, modifications may not be possible.</p>
                        </section>

                        {/* Shipping and Delivery */}
                        <section className="terms-section">
                            <h2>Shipping and Delivery</h2>
                            <p>Shipping times and costs are estimates and may vary based on:</p>
                            <ul>
                                <li>Your location</li>
                                <li>Shipping method selected</li>
                                <li>Product availability</li>
                                <li>Carrier processing times</li>
                                <li>Customs clearance (for international orders)</li>
                            </ul>
                            <p>We are not responsible for delays caused by carriers or customs authorities.</p>
                        </section>

                        {/* Returns and Refunds */}
                        <section className="terms-section">
                            <h2>Returns and Refunds</h2>

                            <h3>Return Policy</h3>
                            <ul>
                                <li>Items may be returned within 30 days of delivery</li>
                                <li>Items must be in original condition and packaging</li>
                                <li>Return shipping costs may apply</li>
                                <li>Certain items may not be returnable (customized items, perishables, etc.)</li>
                            </ul>

                            <h3>Refund Processing</h3>
                            <ul>
                                <li>Refunds will be processed to the original payment method</li>
                                <li>Processing time may vary depending on your bank or card issuer</li>
                                <li>Shipping charges are non-refundable unless the item is defective</li>
                            </ul>
                        </section>

                        {/* Intellectual Property */}
                        <section className="terms-section">
                            <h2>Intellectual Property Rights</h2>
                            <p>The Services and their original content, features, and functionality are owned by Rynott and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>

                            <p>You may not:</p>
                            <ul>
                                <li>Reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services</li>
                                <li>Use any illustrations, photographs, video or audio sequences or any graphics separately from the accompanying text</li>
                                <li>Delete any copyright, trademark, or other proprietary notices from any portion of the Services</li>
                            </ul>
                        </section>

                        {/* User Content */}
                        <section className="terms-section">
                            <h2>User-Generated Content</h2>
                            <p>When you submit content to our Services (reviews, comments, etc.):</p>
                            <ul>
                                <li>You grant us a non-exclusive, royalty-free, perpetual, irrevocable license to use, modify, and display such content</li>
                                <li>You represent that you own or have the necessary rights to submit the content</li>
                                <li>You agree not to submit content that is illegal, offensive, or violates others' rights</li>
                                <li>We reserve the right to remove any content at our discretion</li>
                            </ul>
                        </section>

                        {/* Prohibited Activities */}
                        <section className="terms-section">
                            <h2>Prohibited Activities</h2>
                            <p>You may not use our Services for any unlawful purpose or to solicit others to perform unlawful acts. Prohibited activities include:</p>
                            <ul>
                                <li>Violating any applicable laws or regulations</li>
                                <li>Infringing on intellectual property rights</li>
                                <li>Transmitting malicious code or attempting to gain unauthorized access</li>
                                <li>Using automated systems to access our Services</li>
                                <li>Interfering with the proper working of our Services</li>
                                <li>Impersonating others or providing false information</li>
                            </ul>
                        </section>

                        {/* Disclaimer */}
                        <section className="terms-section">
                            <h2>Disclaimer of Warranties</h2>
                            <p>The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company:</p>
                            <ul>
                                <li>Excludes all representations and warranties relating to this website and its contents</li>
                                <li>Does not warrant that the functions contained in the website will be uninterrupted or error-free</li>
                                <li>Does not warrant that defects will be corrected or that this site or the server that makes it available are free of viruses or bugs</li>
                            </ul>
                        </section>

                        {/* Limitation of Liability */}
                        <section className="terms-section">
                            <h2>Limitation of Liability</h2>
                            <p>In no event shall Rynott or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Rynott's website, even if Rynott or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
                        </section>

                        {/* Governing Law */}
                        <section className="terms-section">
                            <h2>Governing Law</h2>
                            <p>These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
                        </section>

                        {/* Changes to Terms */}
                        <section className="terms-section">
                            <h2>Changes to Terms</h2>
                            <p>We reserve the right to revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.</p>
                        </section>

                        {/* Contact Information */}
                        <section className="terms-section">
                            <h2>Contact Information</h2>
                            <p>If you have any questions about these Terms of Service, please contact us:</p>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <strong>Email:</strong> legal@rynott.com
                                </div>
                                <div className="contact-item">
                                    <strong>Address:</strong> 123 Commerce Street, Shopping District, Business City, BC 12345
                                </div>
                                <div className="contact-item">
                                    <strong>Phone:</strong> +1 (555) 123-4567
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
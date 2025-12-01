import React from 'react';
import { FaShieldAlt, FaLock, FaEye, FaUserShield } from 'react-icons/fa';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy">
            <div className="privacy-hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-icon">
                            <FaShieldAlt />
                        </div>
                        <h1>Privacy Policy</h1>
                        <div className="hero-image">
                            <img
                                src="https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1350&q=80"
                                alt="Privacy document"
                                className="page-hero-image"
                            />
                        </div>
                        <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>
                        <p className="last-updated">Last updated: December 1, 2024</p>
                    </div>
                </div>
            </div>

            <div className="privacy-content">
                <div className="container">
                    <div className="content-wrapper">
                        {/* Introduction */}
                        <section className="policy-section">
                            <h2><FaLock className="section-icon" /> Introduction</h2>
                            <p>
                                Rynott ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.rynott.com or use our services.
                            </p>
                            <p>
                                By using our website and services, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, please do not use our website or services.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section className="policy-section">
                            <h2><FaEye className="section-icon" /> Information We Collect</h2>

                            <h3>Personal Information</h3>
                            <p>We may collect personal information that you voluntarily provide to us when you:</p>
                            <ul>
                                <li>Register for an account</li>
                                <li>Place an order</li>
                                <li>Subscribe to our newsletter</li>
                                <li>Contact us for customer support</li>
                                <li>Participate in surveys or promotions</li>
                            </ul>
                            <p>This information may include:</p>
                            <ul>
                                <li>Name and contact information (email address, phone number, mailing address)</li>
                                <li>Payment information (credit card details, billing address)</li>
                                <li>Account credentials (username, password)</li>
                                <li>Demographic information (age, gender, interests)</li>
                            </ul>

                            <h3>Automatically Collected Information</h3>
                            <p>When you visit our website, we may automatically collect certain information about your device, including:</p>
                            <ul>
                                <li>IP address and location data</li>
                                <li>Browser type and version</li>
                                <li>Operating system</li>
                                <li>Pages you visit on our website</li>
                                <li>Time and date of your visit</li>
                                <li>Referring website addresses</li>
                            </ul>
                        </section>

                        {/* How We Use Your Information */}
                        <section className="policy-section">
                            <h2><FaUserShield className="section-icon" /> How We Use Your Information</h2>
                            <p>We use the information we collect for various purposes, including to:</p>

                            <h3>Service Provision</h3>
                            <ul>
                                <li>Process and fulfill your orders</li>
                                <li>Create and manage your account</li>
                                <li>Provide customer support</li>
                                <li>Send order confirmations and updates</li>
                                <li>Process payments and prevent fraudulent transactions</li>
                            </ul>

                            <h3>Communication</h3>
                            <ul>
                                <li>Send you promotional emails (with your consent)</li>
                                <li>Respond to your inquiries and questions</li>
                                <li>Send you important notices about our services</li>
                                <li>Notify you about changes to our policies</li>
                            </ul>

                            <h3>Improvement and Analytics</h3>
                            <ul>
                                <li>Improve our website and user experience</li>
                                <li>Analyze usage patterns and preferences</li>
                                <li>Develop new features and services</li>
                                <li>Conduct research and analytics</li>
                            </ul>
                        </section>

                        {/* Information Sharing */}
                        <section className="policy-section">
                            <h2>Information Sharing and Disclosure</h2>
                            <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>

                            <h3>Service Providers</h3>
                            <p>We may share your information with trusted third-party service providers who assist us in operating our website, conducting business, or serving users, provided they agree to keep this information confidential.</p>

                            <h3>Legal Requirements</h3>
                            <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p>

                            <h3>Business Transfers</h3>
                            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>
                        </section>

                        {/* Data Security */}
                        <section className="policy-section">
                            <h2>Data Security</h2>
                            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
                            <ul>
                                <li>SSL encryption for data transmission</li>
                                <li>Secure servers and databases</li>
                                <li>Regular security audits and updates</li>
                                <li>Access controls and authentication</li>
                                <li>Employee training on data protection</li>
                            </ul>
                            <p>However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
                        </section>

                        {/* Your Rights */}
                        <section className="policy-section">
                            <h2>Your Rights and Choices</h2>
                            <p>Depending on your location, you may have certain rights regarding your personal information:</p>

                            <h3>Access and Portability</h3>
                            <p>You may request access to the personal information we hold about you and receive a copy in a structured, machine-readable format.</p>

                            <h3>Correction and Deletion</h3>
                            <p>You may request correction of inaccurate information or deletion of your personal information, subject to certain legal limitations.</p>

                            <h3>Marketing Preferences</h3>
                            <p>You can opt out of receiving promotional emails by clicking the unsubscribe link in any email or contacting us directly.</p>

                            <h3>Cookie Preferences</h3>
                            <p>You can control cookie settings through your browser preferences or our cookie consent manager.</p>
                        </section>

                        {/* Cookies and Tracking */}
                        <section className="policy-section">
                            <h2>Cookies and Tracking Technologies</h2>
                            <p>We use cookies and similar tracking technologies to collect and use personal information about you. Cookies are small data files stored on your device that help us:</p>
                            <ul>
                                <li>Remember your preferences and settings</li>
                                <li>Analyze website traffic and usage</li>
                                <li>Provide personalized content and advertisements</li>
                                <li>Improve website functionality</li>
                            </ul>
                            <p>You can control cookie settings through your browser preferences, but disabling certain cookies may limit website functionality.</p>
                        </section>

                        {/* Children's Privacy */}
                        <section className="policy-section">
                            <h2>Children's Privacy</h2>
                            <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.</p>
                        </section>

                        {/* International Transfers */}
                        <section className="policy-section">
                            <h2>International Data Transfers</h2>
                            <p>Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place to protect your information.</p>
                        </section>

                        {/* Policy Updates */}
                        <section className="policy-section">
                            <h2>Changes to This Privacy Policy</h2>
                            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any modifications indicates your acceptance of the updated policy.</p>
                        </section>

                        {/* Contact Information */}
                        <section className="policy-section">
                            <h2>Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <strong>Email:</strong> privacy@rynott.com
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

export default PrivacyPolicy;
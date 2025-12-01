import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUser, FaComment, FaPaperPlane, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import allAPI from '../services/allAPI';
import './ContactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [mapLoaded, setMapLoaded] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');
        setErrorMessage('');

        try {
            const response = await allAPI.submitContactForm(formData);

            if (response.success) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
                // Auto-hide success message after 5 seconds
                setTimeout(() => setSubmitStatus(''), 5000);
            } else {
                setSubmitStatus('error');
                setErrorMessage(response.message || 'Failed to send message');
            }
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage(error.message || 'An error occurred while sending your message');
            console.error('Error submitting form:', error);
        }

        setIsSubmitting(false);
    };

    useEffect(() => {
        // Load map script
        setMapLoaded(true);
    }, []);

    return (
        <div className="contact-us-premium">
            {/* Hero Section */}
            <div className="contact-hero-premium">
                <div className="hero-background">
                    <div className="hero-blur-bg"></div>
                </div>
                <div className="container">
                    <div className="hero-content">
                        <span className="hero-badge bg-light">Get In Touch</span>
                        <h1 className='bg-light'>We're Here to Help</h1>
                        <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="contact-stats">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaClock />
                            </div>
                            <h3>Fast Response</h3>
                            <p>We typically respond within 2 hours</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaUser />
                            </div>
                            <h3>Expert Team</h3>
                            <p>Dedicated support specialists</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaPhone />
                            </div>
                            <h3>24/7 Support</h3>
                            <p>Available round the clock</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="contact-main">
                <div className="container">
                    <div className="contact-grid">
                        {/* Left: Contact Form */}
                        <div className="contact-form-wrapper">
                            <div className="form-header">
                                <h2>Send us a Message</h2>
                                <p>Fill out the form below and our team will get back to you shortly.</p>
                            </div>

                            {submitStatus === 'success' && (
                                <div className="alert alert-success-premium">
                                    <FaCheckCircle className="alert-icon" />
                                    <div className="alert-content">
                                        <strong>Message Sent!</strong>
                                        <p>Thank you! We've received your message. Our team will get back to you soon.</p>
                                    </div>
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className="alert alert-error-premium">
                                    <FaTimesCircle className="alert-icon" />
                                    <div className="alert-content">
                                        <strong>Oops! Something went wrong</strong>
                                        <p>{errorMessage || 'Sorry, there was an error sending your message. Please try again.'}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="contact-form-premium">
                                {/* Name and Email Row */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="John Doe"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="john@example.com"
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                {/* Phone and Subject Row */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 123-4567"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="subject">Subject *</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="form-select"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="order">Order Support</option>
                                            <option value="product">Product Question</option>
                                            <option value="technical">Technical Issue</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="feedback">Feedback</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        placeholder="Tell us more about your inquiry..."
                                        className="form-textarea"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-submit-premium"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-icon"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="btn-icon" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Right: Contact Information */}
                        <div className="contact-info-wrapper">
                            <div className="info-header">
                                <h2>Contact Information</h2>
                                <p>Reach out to us through any of these channels</p>
                            </div>

                            {/* Contact Cards */}
                            <div className="contact-cards">
                                {/* Phone */}
                                <div className="contact-card">
                                    <div className="card-icon phone">
                                        <FaPhone />
                                    </div>
                                    <div className="card-content">
                                        <h3>Phone</h3>
                                        <p className="card-main">+1 (555) 123-4567</p>
                                        <p className="card-sub">+1 (555) 987-6543</p>
                                        <p className="card-hours">Mon-Fri: 9AM-8PM EST</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="contact-card">
                                    <div className="card-icon email">
                                        <FaEnvelope />
                                    </div>
                                    <div className="card-content">
                                        <h3>Email</h3>
                                        <p className="card-main">support@rynott.com</p>
                                        <p className="card-sub">info@rynott.com</p>
                                        <p className="card-hours">Response within 2 hours</p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="contact-card">
                                    <div className="card-icon address">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div className="card-content">
                                        <h3>Address</h3>
                                        <p className="card-main">123 Commerce Street</p>
                                        <p className="card-sub">Business City, BC 12345</p>
                                        <p className="card-hours">Visit our store</p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="contact-card">
                                    <div className="card-icon hours">
                                        <FaClock />
                                    </div>
                                    <div className="card-content">
                                        <h3>Business Hours</h3>
                                        <p className="card-main">Mon-Fri: 9AM-8PM</p>
                                        <p className="card-sub">Sat: 10AM-6PM • Sun: 12PM-5PM</p>
                                        <p className="card-hours">Always available online</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="social-section">
                                <p>Follow us on social media</p>
                                <div className="social-icons">
                                    <a href="#" className="social-icon facebook" title="Facebook">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" className="social-icon twitter" title="Twitter">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#" className="social-icon instagram" title="Instagram">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#" className="social-icon linkedin" title="LinkedIn">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="map-section-premium">
                <div className="container">
                    <div className="map-header">
                        <h2>Find Us Here</h2>
                        <p>Visit our physical location or explore the area around us</p>
                    </div>

                    <div className="map-container-premium">
                        {/* Embedded Map */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00601392346943!3d40.71282570000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e5d9c6cb%3A0x40c6a5770d25022b!2s1600%20Pennsylvania%20Ave%20NW%2C%20Washington%2C%20DC%2020500!5e0!3m2!1sen!2sus!4v1701380800000"
                            width="100%"
                            height="500"
                            style={{ border: 0, borderRadius: '12px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Rynott Location"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section-premium">
                <div className="container">
                    <div className="faq-header">
                        <h2>Frequently Asked Questions</h2>
                        <p>Find answers to common questions</p>
                    </div>

                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>How quickly will I receive a response?</h3>
                            <p>We aim to respond to all inquiries within 2 hours during business hours. For urgent matters, please call us directly.</p>
                        </div>
                        <div className="faq-item">
                            <h3>What are your business hours?</h3>
                            <p>We're open Monday-Friday 9AM-8PM EST, Saturday 10AM-6PM EST, and Sunday 12PM-5PM EST. Our online support is available 24/7.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Can I schedule a call with someone?</h3>
                            <p>Yes! You can call us directly at +1 (555) 123-4567 or mention in your message if you'd prefer a callback.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Do you offer live chat support?</h3>
                            <p>We're working on implementing live chat. For now, please use our contact form or call us directly for immediate assistance.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
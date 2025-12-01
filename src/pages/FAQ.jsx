import React, { useState } from 'react';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch, FaShoppingCart, FaCreditCard, FaShippingFast, FaUndo, FaUserShield } from 'react-icons/fa';
import './FAQ.css';

const FAQ = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedItems, setExpandedItems] = useState({});

    const categories = [
        { id: 'general', name: 'General', icon: <FaQuestionCircle /> },
        { id: 'orders', name: 'Orders', icon: <FaShoppingCart /> },
        { id: 'payment', name: 'Payment', icon: <FaCreditCard /> },
        { id: 'shipping', name: 'Shipping', icon: <FaShippingFast /> },
        { id: 'returns', name: 'Returns', icon: <FaUndo /> },
        { id: 'account', name: 'Account', icon: <FaUserShield /> },
    ];

    const faqData = {
        general: [
            {
                id: 'g1',
                question: 'What is Rynott?',
                answer: 'Rynott is a modern ecommerce platform that connects customers with quality products from trusted sellers worldwide. We focus on providing an exceptional shopping experience with fast delivery, secure payments, and excellent customer service.'
            },
            {
                id: 'g2',
                question: 'How do I create an account?',
                answer: 'Creating an account is easy! Click on "Sign Up" in the top right corner, fill in your details, and verify your email address. You can also register during the checkout process for faster future purchases.'
            },
            {
                id: 'g3',
                question: 'Do I need an account to shop?',
                answer: 'No, you can browse and shop as a guest. However, creating an account gives you access to order history, wishlist, saved addresses, and exclusive member benefits.'
            },
            {
                id: 'g4',
                question: 'Is my personal information secure?',
                answer: 'Yes, we take security seriously. We use SSL encryption to protect your data and comply with privacy regulations. Read our Privacy Policy for detailed information about how we protect your information.'
            }
        ],
        orders: [
            {
                id: 'o1',
                question: 'How can I track my order?',
                answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also view tracking information in your account under "Order History". Click on the tracking number to see real-time updates.'
            },
            {
                id: 'o2',
                question: 'Can I modify or cancel my order?',
                answer: 'You can modify or cancel your order within 1 hour of placement, as long as it hasn\'t been processed yet. Contact our customer service immediately if you need changes.'
            },
            {
                id: 'o3',
                question: 'What if an item is out of stock?',
                answer: 'If an item becomes out of stock after you order, we\'ll notify you immediately and offer alternatives or a full refund. We never ship items that aren\'t available.'
            },
            {
                id: 'o4',
                question: 'How do I reorder previous purchases?',
                answer: 'Visit your Order History in your account, find the previous order, and click "Reorder" to add all items to your cart again. You can also save favorite items to your wishlist for easy reordering.'
            }
        ],
        payment: [
            {
                id: 'p1',
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and other secure payment methods. All transactions are encrypted and secure.'
            },
            {
                id: 'p2',
                question: 'Is my payment information secure?',
                answer: 'Yes, we use industry-standard SSL encryption and work with trusted payment processors. We never store your complete payment information on our servers.'
            },
            {
                id: 'p3',
                question: 'Can I pay with multiple payment methods?',
                answer: 'For security reasons, we process one payment method per order. However, you can place separate orders with different payment methods if needed.'
            },
            {
                id: 'p4',
                question: 'When will I be charged?',
                answer: 'You\'ll be charged when your order is confirmed and ready to ship. For pre-orders, you\'ll be charged when the item becomes available.'
            }
        ],
        shipping: [
            {
                id: 's1',
                question: 'How long does shipping take?',
                answer: 'Standard shipping typically takes 3-7 business days within the continental US. Express shipping (1-2 business days) and overnight shipping are also available. International shipping times vary by destination.'
            },
            {
                id: 's2',
                question: 'Do you offer free shipping?',
                answer: 'Yes! We offer free standard shipping on orders over $50 within the continental US. Premium shipping options are available for an additional fee.'
            },
            {
                id: 's3',
                question: 'Do you ship internationally?',
                answer: 'Yes, we ship to over 100 countries worldwide. International shipping rates and delivery times vary by destination. Customs duties and taxes may apply.'
            },
            {
                id: 's4',
                question: 'What if my package is lost or damaged?',
                answer: 'If your package is lost or arrives damaged, contact us immediately. We\'ll work with the carrier to resolve the issue and ensure you receive your order or a full refund.'
            }
        ],
        returns: [
            {
                id: 'r1',
                question: 'What is your return policy?',
                answer: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Customized, perishable, and intimate items may not be returnable for hygiene reasons.'
            },
            {
                id: 'r2',
                question: 'How do I initiate a return?',
                answer: 'Log into your account, go to Order History, and click "Return" next to the item you want to return. Follow the prompts to generate a return label.'
            },
            {
                id: 'r3',
                question: 'Who pays for return shipping?',
                answer: 'Return shipping is free for defective items or our shipping errors. For other returns, return shipping costs may be deducted from your refund amount.'
            },
            {
                id: 'r4',
                question: 'How long do refunds take?',
                answer: 'Refunds are processed within 3-5 business days after we receive your return. The time for the refund to appear in your account depends on your bank or card issuer (typically 5-10 business days).'
            }
        ],
        account: [
            {
                id: 'a1',
                question: 'How do I reset my password?',
                answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions. You\'ll receive a secure link to reset your password.'
            },
            {
                id: 'a2',
                question: 'Can I delete my account?',
                answer: 'Yes, you can request account deletion by contacting customer service. Note that this action is permanent and will remove all your order history and saved information.'
            },
            {
                id: 'a3',
                question: 'How do I update my personal information?',
                answer: 'Log into your account and go to "Profile Settings" to update your name, email, phone number, and addresses. You can also manage your communication preferences there.'
            },
            {
                id: 'a4',
                question: 'What are the benefits of creating an account?',
                answer: 'Account holders enjoy faster checkout, order history access, wishlist saving, address book management, exclusive promotions, and personalized product recommendations.'
            }
        ]
    };

    const toggleExpanded = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const filteredFAQs = faqData[activeCategory]?.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="faq">
            <div className="faq-hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-icon">
                            <FaQuestionCircle />
                        </div>
                        <h1>Frequently Asked Questions</h1>
                        <div className="hero-image">
                            <img
                                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1350&q=80"
                                alt="FAQ illustration"
                                className="page-hero-image"
                            />
                        </div>
                        <p>Find answers to common questions about shopping with Rynott.</p>

                        {/* Search Bar */}
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search for answers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="faq-content">
                <div className="container">
                    <div className="faq-wrapper">
                        {/* Category Tabs */}
                        <div className="faq-categories">
                            <h3>Categories</h3>
                            <div className="category-tabs">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(category.id)}
                                    >
                                        <span className="category-icon">{category.icon}</span>
                                        <span className="category-name">{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Items */}
                        <div className="faq-items">
                            <h3>{categories.find(cat => cat.id === activeCategory)?.name} Questions</h3>

                            {filteredFAQs.length === 0 ? (
                                <div className="no-results">
                                    <p>No questions found for "{searchTerm}". Try searching with different keywords.</p>
                                </div>
                            ) : (
                                <div className="faq-list">
                                    {filteredFAQs.map(item => (
                                        <div key={item.id} className="faq-item">
                                            <button
                                                className="faq-question"
                                                onClick={() => toggleExpanded(item.id)}
                                            >
                                                <span className="question-text">{item.question}</span>
                                                <span className="question-icon">
                                                    {expandedItems[item.id] ? <FaChevronUp /> : <FaChevronDown />}
                                                </span>
                                            </button>

                                            {expandedItems[item.id] && (
                                                <div className="faq-answer">
                                                    <p>{item.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="faq-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Still have questions?</h2>
                        <p>Our customer support team is here to help you with any questions not covered in our FAQ.</p>
                        <div className="cta-buttons">
                            <a href="/contact" className="btn btn-primary">Contact Support</a>
                            <a href="mailto:support@rynott.com" className="btn btn-outline">Email Us</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
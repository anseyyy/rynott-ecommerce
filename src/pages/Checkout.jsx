import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaShippingFast, FaCheckCircle, FaLock, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../services/commonAPI';
import allAPI from '../services/allAPI';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, cartTotal, clearCart } = useCart();
    const [currentStep, setCurrentStep] = useState('shipping');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form states
    const [shippingData, setShippingData] = useState({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        phone: ''
    });

    const [billingData, setBillingData] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('card');
    const [sameAsShipping, setSameAsShipping] = useState(true);

    // Redirect to cart if no items
    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateShippingStep = () => {
        const requiredFields = ['firstName', 'lastName', 'street', 'city', 'state', 'country', 'postalCode', 'phone'];
        for (let field of requiredFields) {
            if (!shippingData[field]?.trim()) {
                setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }
        setError('');
        return true;
    };

    const validateBillingStep = () => {
        if (!sameAsShipping) {
            const requiredFields = ['street', 'city', 'state', 'country', 'postalCode'];
            for (let field of requiredFields) {
                if (!billingData[field]?.trim()) {
                    setError(`Please fill in billing ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                    return false;
                }
            }
        }
        setError('');
        return true;
    };

    const handleNextStep = () => {
        if (currentStep === 'shipping') {
            if (validateShippingStep()) {
                setCurrentStep('billing');
            }
        } else if (currentStep === 'billing') {
            if (validateBillingStep()) {
                setCurrentStep('payment');
            }
        }
    };

    const handlePreviousStep = () => {
        if (currentStep === 'billing') {
            setCurrentStep('shipping');
        } else if (currentStep === 'payment') {
            setCurrentStep('billing');
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        try {
            // Prepare order data
            const orderData = {
                orderItems: items.map(item => ({
                    product: item.product._id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.images && item.product.images.length > 0 ? item.product.images[0].url : ''
                })),
                shippingAddress: {
                    street: shippingData.street,
                    city: shippingData.city,
                    state: shippingData.state,
                    country: shippingData.country,
                    postalCode: shippingData.postalCode
                },
                billingAddress: sameAsShipping ? {
                    street: shippingData.street,
                    city: shippingData.city,
                    state: shippingData.state,
                    country: shippingData.country,
                    postalCode: shippingData.postalCode
                } : {
                    street: billingData.street,
                    city: billingData.city,
                    state: billingData.state,
                    country: billingData.country,
                    postalCode: billingData.postalCode
                },
                paymentMethod: paymentMethod,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: cartTotal
            };

            // Call API to create order
            const response = await allAPI.createOrder(orderData);

            if (response?.success || response?.data?._id) {
                setSuccess(true);
                clearCart();
                // Redirect to order confirmation after 2 seconds
                setTimeout(() => {
                    navigate(`/order-confirmation/${response.data._id || response.data.id}`, {
                        state: { order: response.data }
                    });
                }, 1500);
            } else {
                setError(response?.message || 'Failed to create order. Please try again.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while creating your order');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return null;
    }

    // Calculate tax and shipping (example: 10% tax, free shipping over $100)
    const taxPrice = parseFloat((cartTotal * 0.1).toFixed(2));
    const shippingPrice = cartTotal >= 100 ? 0 : 9.99;
    const finalTotal = cartTotal + taxPrice + shippingPrice;

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-header">
                    <h1>Secure Checkout</h1>
                    <p>Step {currentStep === 'shipping' ? 1 : currentStep === 'billing' ? 2 : 3} of 3 - Complete your purchase</p>
                </div>

                <div className="checkout-container">
                    <div className="checkout-main">
                        {/* Error Message */}
                        {error && <div className="error-alert">{error}</div>}
                        {success && <div className="success-alert">Order placed successfully! Redirecting...</div>}

                        {/* Shipping Step */}
                        {currentStep === 'shipping' && (
                            <div className="checkout-section">
                                <div className="section-header">
                                    <FaShippingFast className="section-icon" />
                                    <h2>Shipping Information</h2>
                                </div>
                                <form className="checkout-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={shippingData.firstName}
                                                onChange={handleShippingChange}
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={shippingData.lastName}
                                                onChange={handleShippingChange}
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Street Address</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={shippingData.street}
                                            onChange={handleShippingChange}
                                            placeholder="123 Main Street"
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={shippingData.city}
                                                onChange={handleShippingChange}
                                                placeholder="New York"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>State/Province</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={shippingData.state}
                                                onChange={handleShippingChange}
                                                placeholder="NY"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={shippingData.country}
                                                onChange={handleShippingChange}
                                                placeholder="United States"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Postal Code</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={shippingData.postalCode}
                                                onChange={handleShippingChange}
                                                placeholder="10001"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingData.phone}
                                            onChange={handleShippingChange}
                                            placeholder="+1 (555) 123-4567"
                                            required
                                        />
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Billing Step */}
                        {currentStep === 'billing' && (
                            <div className="checkout-section">
                                <div className="section-header">
                                    <FaCreditCard className="section-icon" />
                                    <h2>Billing Information</h2>
                                </div>

                                <div className="checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="sameAsShipping"
                                        checked={sameAsShipping}
                                        onChange={(e) => setSameAsShipping(e.target.checked)}
                                    />
                                    <label htmlFor="sameAsShipping">Billing address same as shipping</label>
                                </div>

                                {!sameAsShipping && (
                                    <form className="checkout-form">
                                        <div className="form-group">
                                            <label>Street Address</label>
                                            <input
                                                type="text"
                                                name="street"
                                                value={billingData.street}
                                                onChange={handleBillingChange}
                                                placeholder="123 Main Street"
                                                required
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={billingData.city}
                                                    onChange={handleBillingChange}
                                                    placeholder="New York"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>State/Province</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={billingData.state}
                                                    onChange={handleBillingChange}
                                                    placeholder="NY"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Country</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={billingData.country}
                                                    onChange={handleBillingChange}
                                                    placeholder="United States"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Postal Code</label>
                                                <input
                                                    type="text"
                                                    name="postalCode"
                                                    value={billingData.postalCode}
                                                    onChange={handleBillingChange}
                                                    placeholder="10001"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Payment Step */}
                        {currentStep === 'payment' && (
                            <div className="checkout-section">
                                <div className="section-header">
                                    <FaLock className="section-icon" />
                                    <h2>Payment Method</h2>
                                </div>

                                <div className="payment-options">
                                    <div className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            id="card"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label htmlFor="card">
                                            <FaCreditCard /> Credit Card
                                        </label>
                                    </div>

                                    <div className={`payment-option ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            id="paypal"
                                            name="payment"
                                            value="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label htmlFor="paypal">PayPal</label>
                                    </div>

                                    <div className={`payment-option ${paymentMethod === 'bank_transfer' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            id="bank"
                                            name="payment"
                                            value="bank_transfer"
                                            checked={paymentMethod === 'bank_transfer'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label htmlFor="bank">Bank Transfer</label>
                                    </div>

                                    <div className={`payment-option ${paymentMethod === 'cash_on_delivery' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="payment"
                                            value="cash_on_delivery"
                                            checked={paymentMethod === 'cash_on_delivery'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label htmlFor="cod">Cash on Delivery</label>
                                    </div>
                                </div>

                                {paymentMethod === 'card' && (
                                    <form className="checkout-form">
                                        <div className="form-group">
                                            <label>Cardholder Name</label>
                                            <input type="text" placeholder={`${shippingData.firstName} ${shippingData.lastName}`} disabled />
                                        </div>

                                        <div className="form-group">
                                            <label>Card Number</label>
                                            <input type="text" placeholder="4111 1111 1111 1111" disabled />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Expiry Date</label>
                                                <input type="text" placeholder="MM/YY" disabled />
                                            </div>
                                            <div className="form-group">
                                                <label>CVV</label>
                                                <input type="text" placeholder="123" disabled />
                                            </div>
                                        </div>
                                        <p className="payment-note">Payment processing will be enabled after order creation</p>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="checkout-navigation">
                            <button
                                className="btn btn-outline"
                                onClick={currentStep === 'shipping' ? () => navigate('/cart') : handlePreviousStep}
                            >
                                <FaArrowLeft /> {currentStep === 'shipping' ? 'Back to Cart' : 'Previous Step'}
                            </button>

                            {currentStep !== 'payment' && (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleNextStep}
                                >
                                    Next Step
                                </button>
                            )}

                            {currentStep === 'payment' && (
                                <button
                                    className="btn btn-primary"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                >
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="checkout-summary">
                        <h3>Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})</h3>
                        <div className="summary-items">
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <div key={item.product._id} className="summary-item">
                                        <img
                                            src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : "https://images.unsplash.com/photo-1510557880182-3d4d3e3f3c57?auto=format&fit=crop&w=100&q=80"}
                                            alt={item.product.name}
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1510557880182-3d4d3e3f3c57?auto=format&fit=crop&w=100&q=80";
                                            }}
                                        />
                                        <div className="summary-item-details">
                                            <p className="item-name">{item.product.name}</p>
                                            <p className="item-qty">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="item-total">{formatPrice(item.product.price * item.quantity)}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-cart-msg">Your cart is empty</p>
                            )}
                        </div>

                        <div className="summary-totals">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="total-row">
                                <span>Tax (10%):</span>
                                <span>{formatPrice(taxPrice)}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping:</span>
                                <span>{shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}</span>
                            </div>
                            <div className="total-row final">
                                <span>Total:</span>
                                <span>{formatPrice(finalTotal)}</span>
                            </div>
                        </div>

                        <div className="security-badges">
                            <p><FaLock /> Secure Checkout</p>
                            <p>Your payment information is safe</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

import React from 'react';
import { FaShoppingCart, FaTruck, FaShieldAlt, FaCreditCard, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../services/commonAPI';
import './Cart.css';

const Cart = () => {
    const { items, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart();

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity >= 0) {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleRemoveItem = async (productId) => {
        const result = await removeFromCart(productId);
        if (result.success) {
            // Item removed successfully
        } else {
            // Handle error - could show a toast or alert
            console.error('Failed to remove item:', result.error);
        }
    };

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="cart-header">
                        <h1>Shopping Cart</h1>
                        <p>Review your items and proceed to checkout</p>
                    </div>

                    <div className="cart-content">
                        
                        <FaShoppingCart className="cart-icon" />
                        <h2>Your Cart is Empty</h2>
                        <p>Looks like you haven't added any items to your cart yet. Start shopping to fill it up!</p>

                        <div className="cart-actions">
                            <a href="/products" className="btn btn-primary">Continue Shopping</a>
                            <a href="/" className="btn btn-outline">Browse Categories</a>
                        </div>

                        <div className="cart-benefits">
                            <div className="benefit-card">
                                <FaTruck className="benefit-icon" />
                                <h3>Free Shipping</h3>
                                <p>Free delivery on orders over $50</p>
                            </div>
                            <div className="benefit-card">
                                <FaShieldAlt className="benefit-icon" />
                                <h3>Secure Checkout</h3>
                                <p>Your payment information is safe and secure</p>
                            </div>
                            <div className="benefit-card">
                                <FaCreditCard className="benefit-icon" />
                                <h3>Easy Returns</h3>
                                <p>30-day hassle-free return policy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <p>You have {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.product?._id || Math.random()} className="cart-item">
                                <div className="cart-item-image">
                                    <img
                                        src={item.product && item.product.images && item.product.images.length > 0 ? item.product.images[0].url : "https://images.unsplash.com/photo-1510557880182-3d4d3e3f3c57?auto=format&fit=crop&w=300&q=80"}
                                        alt={item.product?.name || "Product"}
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1510557880182-3d4d3e3f3c57?auto=format&fit=crop&w=300&q=80";
                                        }}
                                    />
                                </div>
                                <div className="cart-item-details">
                                    <h3>{item.product?.name || "Product"}</h3>
                                    <p className="cart-item-price">{formatPrice(item.product?.price || 0)}</p>
                                    <div className="cart-item-controls">
                                        <div className="quantity-controls">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <FaMinus />
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)}
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemoveItem(item.product?._id)}
                                        >
                                            <FaTrash /> Remove
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-item-total">
                                    {formatPrice((item.product?.price || 0) * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="cart-total">
                            <h3>Total: {formatPrice(cartTotal)}</h3>
                        </div>
                        <div className="cart-actions">
                            <a href="/products" className="btn btn-outline">Continue Shopping</a>
                            <a href="/checkout" className="btn btn-primary">Proceed to Checkout</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
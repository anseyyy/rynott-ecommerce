import React, { createContext, useContext, useReducer, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { apiBaseUrl } from '../services/serverURL';

// Cart Context
const CartContext = createContext();

// Cart Actions
const cartActions = {
    LOAD_CART_START: 'LOAD_CART_START',
    LOAD_CART_SUCCESS: 'LOAD_CART_SUCCESS',
    LOAD_CART_FAILURE: 'LOAD_CART_FAILURE',
    ADD_TO_CART_START: 'ADD_TO_CART_START',
    ADD_TO_CART_SUCCESS: 'ADD_TO_CART_SUCCESS',
    ADD_TO_CART_FAILURE: 'ADD_TO_CART_FAILURE',
    REMOVE_FROM_CART_START: 'REMOVE_FROM_CART_START',
    REMOVE_FROM_CART_SUCCESS: 'REMOVE_FROM_CART_SUCCESS',
    REMOVE_FROM_CART_FAILURE: 'REMOVE_FROM_CART_FAILURE',
    UPDATE_QUANTITY_START: 'UPDATE_QUANTITY_START',
    UPDATE_QUANTITY_SUCCESS: 'UPDATE_QUANTITY_SUCCESS',
    UPDATE_QUANTITY_FAILURE: 'UPDATE_QUANTITY_FAILURE',
    CLEAR_CART_START: 'CLEAR_CART_START',
    CLEAR_CART_SUCCESS: 'CLEAR_CART_SUCCESS',
    CLEAR_CART_FAILURE: 'CLEAR_CART_FAILURE',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Cart Reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case cartActions.LOAD_CART_START:
        case cartActions.ADD_TO_CART_START:
        case cartActions.REMOVE_FROM_CART_START:
        case cartActions.UPDATE_QUANTITY_START:
        case cartActions.CLEAR_CART_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case cartActions.LOAD_CART_SUCCESS:
            return {
                ...state,
                isLoading: false,
                items: action.payload.items || [],
                totalItems: action.payload.totalItems || 0,
                totalPrice: action.payload.totalPrice || 0,
                error: null
            };

        case cartActions.ADD_TO_CART_SUCCESS:
        case cartActions.REMOVE_FROM_CART_SUCCESS:
        case cartActions.UPDATE_QUANTITY_SUCCESS:
        case cartActions.CLEAR_CART_SUCCESS:
            return {
                ...state,
                isLoading: false,
                items: action.payload.items || [],
                totalItems: action.payload.totalItems || 0,
                totalPrice: action.payload.totalPrice || 0,
                error: null
            };

        case cartActions.LOAD_CART_FAILURE:
        case cartActions.ADD_TO_CART_FAILURE:
        case cartActions.REMOVE_FROM_CART_FAILURE:
        case cartActions.UPDATE_QUANTITY_FAILURE:
        case cartActions.CLEAR_CART_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        case cartActions.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

// Initial State
const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: true,
    error: null
};

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

// Helper: compute totals from items
const computeTotals = (items = []) => {
    const totalItems = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    const totalPrice = items.reduce((sum, it) => {
        const price = (it.product && (it.product.price || it.price)) || 0;
        return sum + price * (it.quantity || 0);
    }, 0);
    return { totalItems, totalPrice };
};

// Guest cart localStorage key
const GUEST_CART_KEY = 'rynott_guest_cart_v1';

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user, token, isAuthenticated } = useAuth();

    // Load cart from backend when user is authenticated; otherwise load guest cart from localStorage
    useEffect(() => {
        const loadCart = async () => {
            if (isAuthenticated && token) {
                dispatch({ type: cartActions.LOAD_CART_START });

                try {
                    const response = await fetch(`${apiBaseUrl}/cart`, {
                        headers: getAuthHeaders(token)
                    });

                    const data = await response.json();

                    if (response.ok) {
                        const cartData = data.data.cart;
                        dispatch({
                            type: cartActions.LOAD_CART_SUCCESS,
                            payload: {
                                items: cartData.items || [],
                                totalItems: cartData.totalItems || 0,
                                totalPrice: cartData.totalPrice || 0
                            }
                        });
                    } else {
                        dispatch({
                            type: cartActions.LOAD_CART_FAILURE,
                            payload: data.message || 'Failed to load cart'
                        });
                    }
                } catch (error) {
                    dispatch({
                        type: cartActions.LOAD_CART_FAILURE,
                        payload: 'Network error. Please try again.'
                    });
                }
            } else {
                // Load guest cart from localStorage
                try {
                    const raw = localStorage.getItem(GUEST_CART_KEY);
                    const guest = raw ? JSON.parse(raw) : { items: [] };
                    const items = Array.isArray(guest.items) ? guest.items : [];
                    const totals = computeTotals(items);
                    dispatch({
                        type: cartActions.LOAD_CART_SUCCESS,
                        payload: { items, totalItems: totals.totalItems, totalPrice: totals.totalPrice }
                    });
                } catch (err) {
                    // fallback to empty cart
                    dispatch({
                        type: cartActions.LOAD_CART_SUCCESS,
                        payload: { items: [], totalItems: 0, totalPrice: 0 }
                    });
                }
            }
        };

        loadCart();
    }, [isAuthenticated, token]);

    // Cart Actions
    const normalizeId = (val) => {
        if (!val && val !== 0) return null;
        try { return String(val); } catch (e) { return null; }
    };

    const getItemProductId = (item) => {
        if (!item) return null;
        const p = item.product;
        if (!p && p !== 0) return null;
        if (typeof p === 'string') return normalizeId(p);
        return normalizeId(p._id || p.id || p);
    };

    const addToCart = useCallback(async (product, qty = 1) => {
        const productId = normalizeId(product && (product._id || product.id || (product.product && (product.product._id || product.product.id))));

        if (!productId) {
            dispatch({ type: cartActions.ADD_TO_CART_FAILURE, payload: 'Invalid product ID' });
            return { success: false, error: 'Invalid product ID' };
        }

        // Guest flow: persist in localStorage
        if (!isAuthenticated || !token) {
            dispatch({ type: cartActions.ADD_TO_CART_START });
            try {
                const raw = localStorage.getItem(GUEST_CART_KEY);
                const guest = raw ? JSON.parse(raw) : { items: [] };
                const items = Array.isArray(guest.items) ? guest.items : [];

                // find existing item
                const existingIndex = items.findIndex(it => getItemProductId(it) === productId);

                if (existingIndex > -1) {
                    items[existingIndex].quantity = (items[existingIndex].quantity || 0) + qty;
                } else {
                    // snapshot product minimal fields for rendering
                    const snapshot = {
                        _id: productId,
                        name: product.name || (product.product && product.product.name) || '',
                        price: product.price || (product.product && product.product.price) || 0,
                        images: product.images || (product.product && product.product.images) || (product.image ? [{ url: product.image }] : [])
                    };
                    items.push({ product: snapshot, quantity: qty });
                }

                const newGuest = { items };
                localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newGuest));

                const totals = computeTotals(items);
                dispatch({
                    type: cartActions.ADD_TO_CART_SUCCESS,
                    payload: { items, totalItems: totals.totalItems, totalPrice: totals.totalPrice }
                });
                return { success: true };
            } catch (err) {
                dispatch({ type: cartActions.ADD_TO_CART_FAILURE, payload: 'Failed to add to cart' });
                return { success: false, error: 'Failed to add to cart' };
            }
        }

        // Authenticated flow: call backend
        dispatch({ type: cartActions.ADD_TO_CART_START });
        try {
            console.log('Adding to cart (auth):', productId);
            const response = await fetch(`${apiBaseUrl}/cart`, {
                method: 'POST',
                headers: getAuthHeaders(token),
                body: JSON.stringify({ productId, quantity: qty })
            });

            const data = await response.json();
            if (response.ok) {
                const cartData = data.data?.cart || data.data;
                dispatch({
                    type: cartActions.ADD_TO_CART_SUCCESS,
                    payload: {
                        items: cartData.items || [],
                        totalItems: cartData.totalItems || 0,
                        totalPrice: cartData.totalPrice || 0
                    }
                });
                return { success: true };
            } else {
                dispatch({ type: cartActions.ADD_TO_CART_FAILURE, payload: data.message || 'Failed to add item to cart' });
                return { success: false, error: data.message };
            }
        } catch (error) {
            dispatch({ type: cartActions.ADD_TO_CART_FAILURE, payload: 'Network error. Please try again.' });
            return { success: false, error: 'Network error. Please try again.' };
        }
    }, [isAuthenticated, token]);

    const removeFromCart = useCallback(async (productId) => {
        if (!productId) {
            return { success: false, error: 'Invalid product ID' };
        }

        // Guest flow
        if (!isAuthenticated || !token) {
            dispatch({ type: cartActions.REMOVE_FROM_CART_START });
            try {
                const raw = localStorage.getItem(GUEST_CART_KEY);
                const guest = raw ? JSON.parse(raw) : { items: [] };
                const items = Array.isArray(guest.items) ? guest.items : [];
                console.debug('Guest removeFromCart - before', { productId, items });
                const filtered = items.filter(it => getItemProductId(it) !== normalizeId(productId));
                localStorage.setItem(GUEST_CART_KEY, JSON.stringify({ items: filtered }));
                const totals = computeTotals(filtered);
                dispatch({ type: cartActions.REMOVE_FROM_CART_SUCCESS, payload: { items: filtered, totalItems: totals.totalItems, totalPrice: totals.totalPrice } });
                console.debug('Guest removeFromCart - after', { productId, items: filtered });
                return { success: true };
            } catch (err) {
                console.error('Guest removeFromCart error', err);
                dispatch({ type: cartActions.REMOVE_FROM_CART_FAILURE, payload: 'Failed to remove item' });
                return { success: false, error: 'Failed to remove item' };
            }
        }

        // Authenticated flow
        dispatch({ type: cartActions.REMOVE_FROM_CART_START });
        try {
            const response = await fetch(`${apiBaseUrl}/cart/${productId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(token)
            });

            const data = await response.json();

            if (response.ok) {
                const cartData = data.data.cart;
                dispatch({ type: cartActions.REMOVE_FROM_CART_SUCCESS, payload: { items: cartData.items || [], totalItems: cartData.totalItems || 0, totalPrice: cartData.totalPrice || 0 } });
                return { success: true };
            } else {
                dispatch({ type: cartActions.REMOVE_FROM_CART_FAILURE, payload: data.message || 'Failed to remove item from cart' });
                return { success: false, error: data.message || 'Failed to remove item from cart' };
            }
        } catch (error) {
            dispatch({ type: cartActions.REMOVE_FROM_CART_FAILURE, payload: 'Network error. Please try again.' });
            return { success: false, error: 'Network error. Please try again.' };
        }
    }, [isAuthenticated, token]);

    const updateQuantity = useCallback(async (productId, quantity) => {
        if (!productId) return { success: false, error: 'Invalid product ID' };

        // Guest flow
        if (!isAuthenticated || !token) {
            dispatch({ type: cartActions.UPDATE_QUANTITY_START });
            try {
                const raw = localStorage.getItem(GUEST_CART_KEY);
                const guest = raw ? JSON.parse(raw) : { items: [] };
                const items = Array.isArray(guest.items) ? guest.items : [];
                console.debug('Guest updateQuantity - before', { productId, quantity, items });

                if (quantity <= 0) {
                    const filtered = items.filter(it => getItemProductId(it) !== normalizeId(productId));
                    localStorage.setItem(GUEST_CART_KEY, JSON.stringify({ items: filtered }));
                    const totals = computeTotals(filtered);
                    dispatch({ type: cartActions.UPDATE_QUANTITY_SUCCESS, payload: { items: filtered, totalItems: totals.totalItems, totalPrice: totals.totalPrice } });
                    console.debug('Guest updateQuantity - removed item', { productId, items: filtered });
                    return { success: true };
                }

                const idx = items.findIndex(it => getItemProductId(it) === normalizeId(productId));
                if (idx > -1) {
                    items[idx].quantity = quantity;
                    localStorage.setItem(GUEST_CART_KEY, JSON.stringify({ items }));
                    const totals = computeTotals(items);
                    dispatch({ type: cartActions.UPDATE_QUANTITY_SUCCESS, payload: { items, totalItems: totals.totalItems, totalPrice: totals.totalPrice } });
                    console.debug('Guest updateQuantity - after', { productId, quantity, items });
                    return { success: true };
                }

                console.debug('Guest updateQuantity - item not found', { productId });
                return { success: false, error: 'Item not found' };
            } catch (err) {
                console.error('Guest updateQuantity error', err);
                dispatch({ type: cartActions.UPDATE_QUANTITY_FAILURE, payload: 'Failed to update quantity' });
                return { success: false, error: 'Failed to update quantity' };
            }
        }

        // Authenticated flow
        dispatch({ type: cartActions.UPDATE_QUANTITY_START });
        try {
            const response = await fetch(`${apiBaseUrl}/cart/${productId}`, {
                method: 'PUT',
                headers: getAuthHeaders(token),
                body: JSON.stringify({ quantity })
            });

            const data = await response.json();

            if (response.ok) {
                const cartData = data.data.cart;
                dispatch({ type: cartActions.UPDATE_QUANTITY_SUCCESS, payload: { items: cartData.items || [], totalItems: cartData.totalItems || 0, totalPrice: cartData.totalPrice || 0 } });
                return { success: true };
            } else {
                dispatch({ type: cartActions.UPDATE_QUANTITY_FAILURE, payload: data.message || 'Failed to update quantity' });
                return { success: false, error: data.message };
            }
        } catch (error) {
            dispatch({ type: cartActions.UPDATE_QUANTITY_FAILURE, payload: 'Network error. Please try again.' });
            return { success: false, error: 'Network error. Please try again.' };
        }
    }, [isAuthenticated, token]);

    const clearCart = useCallback(async () => {
        // Guest flow
        if (!isAuthenticated || !token) {
            dispatch({ type: cartActions.CLEAR_CART_START });
            try {
                localStorage.removeItem(GUEST_CART_KEY);
                dispatch({ type: cartActions.CLEAR_CART_SUCCESS, payload: { items: [], totalItems: 0, totalPrice: 0 } });
                return { success: true };
            } catch (err) {
                dispatch({ type: cartActions.CLEAR_CART_FAILURE, payload: 'Failed to clear cart' });
                return { success: false, error: 'Failed to clear cart' };
            }
        }

        // Authenticated flow
        dispatch({ type: cartActions.CLEAR_CART_START });
        try {
            const response = await fetch(`${apiBaseUrl}/cart`, {
                method: 'DELETE',
                headers: getAuthHeaders(token)
            });

            const data = await response.json();

            if (response.ok) {
                const cartData = data.data.cart;
                dispatch({ type: cartActions.CLEAR_CART_SUCCESS, payload: { items: cartData.items || [], totalItems: cartData.totalItems || 0, totalPrice: cartData.totalPrice || 0 } });
                return { success: true };
            } else {
                dispatch({ type: cartActions.CLEAR_CART_FAILURE, payload: data.message || 'Failed to clear cart' });
                return { success: false, error: data.message };
            }
        } catch (error) {
            dispatch({ type: cartActions.CLEAR_CART_FAILURE, payload: 'Network error. Please try again.' });
            return { success: false, error: 'Network error. Please try again.' };
        }
    }, [isAuthenticated, token]);

    // Clear error function
    const clearError = useCallback(() => {
        dispatch({ type: cartActions.CLEAR_ERROR });
    }, []);

    // Computed values
    const cartCount = useMemo(() => state.totalItems, [state.totalItems]);
    const isEmpty = useMemo(() => state.items.length === 0, [state.items.length]);

    const value = useMemo(() => ({
        ...state,
        cartCount,
        cartTotal: state.totalPrice, // Alias for compatibility
        isEmpty,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearError
    }), [state, cartCount, isEmpty, addToCart, removeFromCart, updateQuantity, clearCart, clearError]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;

import React, { createContext, useContext, useReducer, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../services/serverURL';

// Auth Context
const AuthContext = createContext();

// Auth Actions
const authActions = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    LOAD_USER: 'LOAD_USER',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Auth Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case authActions.LOGIN_START:
        case authActions.REGISTER_START:
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case authActions.LOGIN_SUCCESS:
        case authActions.REGISTER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                error: null
            };

        case authActions.LOGIN_FAILURE:
        case authActions.REGISTER_FAILURE:
            return {
                ...state,
                isLoading: false,
                user: null,
                token: null,
                isAuthenticated: false,
                error: action.payload
            };

        case authActions.LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            };

        case authActions.LOAD_USER:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                isLoading: false
            };

        case authActions.CLEAR_ERROR:
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
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    error: null
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user from token on mount
    const loadUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${apiBaseUrl}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    dispatch({
                        type: authActions.LOAD_USER,
                        payload: data.data.user
                    });
                } else {
                    // Token is invalid
                    localStorage.removeItem('token');
                    dispatch({ type: authActions.LOGOUT });
                }
            } catch (error) {
                console.error('Failed to load user:', error);
                localStorage.removeItem('token');
                dispatch({ type: authActions.LOGOUT });
            }
        } else {
            dispatch({ type: authActions.LOGOUT });
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Save token to localStorage when it changes
    useEffect(() => {
        if (state.token) {
            localStorage.setItem('token', state.token);
        } else {
            localStorage.removeItem('token');
        }
    }, [state.token]);

    // Login function
    const login = useCallback(async (email, password) => {
        dispatch({ type: authActions.LOGIN_START });

        try {
            const response = await fetch(`${apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({
                    type: authActions.LOGIN_SUCCESS,
                    payload: {
                        user: data.data.user,
                        token: data.data.token
                    }
                });
                return { success: true };
            } else {
                dispatch({
                    type: authActions.LOGIN_FAILURE,
                    payload: data.message || 'Login failed'
                });
                return { success: false, error: data.message };
            }
        } catch (error) {
            dispatch({
                type: authActions.LOGIN_FAILURE,
                payload: 'Network error. Please try again.'
            });
            return { success: false, error: 'Network error. Please try again.' };
        }
    }, []);

    // Register function
    const register = useCallback(async (userData) => {
        dispatch({ type: authActions.REGISTER_START });

        try {
            const response = await fetch(`${apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({
                    type: authActions.REGISTER_SUCCESS,
                    payload: {
                        user: data.data.user,
                        token: data.data.token
                    }
                });
                return { success: true };
            } else {
                dispatch({
                    type: authActions.REGISTER_FAILURE,
                    payload: data.message || 'Registration failed'
                });
                return { success: false, error: data.message };
            }
        } catch (error) {
            dispatch({
                type: authActions.REGISTER_FAILURE,
                payload: 'Network error. Please try again.'
            });
            return { success: false, error: 'Network error. Please try again.' };
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        try {
            await fetch(`${apiBaseUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            dispatch({ type: authActions.LOGOUT });
        }
    }, [state.token]);

    // Clear error function
    const clearError = useCallback(() => {
        dispatch({ type: authActions.CLEAR_ERROR });
    }, []);

    const value = useMemo(() => ({
        ...state,
        login,
        register,
        logout,
        clearError
    }), [state, login, register, logout, clearError]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
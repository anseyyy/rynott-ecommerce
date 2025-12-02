import React, { useState } from 'react';
import { autoLoginAdmin } from '../../services/devLogin';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import './LoginHelper.css';

const LoginHelper = () => {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    const handleAutoLogin = async () => {
        setLoading(true);
        setResult(null);

        try {
            const loginResult = await autoLoginAdmin();
            setResult(loginResult);

            if (loginResult.success) {
                // Reload page to update auth context
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 1000);
            }
        } catch (error) {
            setResult({ success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-helper">
            <div className="login-helper-container">
                <h1>🔐 Admin Login Helper</h1>
                <p>This page helps you log in as an admin user for development and testing.</p>

                <div className="login-info">
                    <h3>Admin Credentials:</h3>
                    <ul>
                        <li><strong>Email:</strong> admin@rynott.com</li>
                        <li><strong>Password:</strong> admin123</li>
                    </ul>
                </div>

                <button
                    onClick={handleAutoLogin}
                    disabled={loading}
                    className="btn btn-primary btn-large"
                >
                    {loading ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Logging in...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-sign-in-alt"></i>
                            Auto Login as Admin
                        </>
                    )}
                </button>

                {result && (
                    <div className={`login-result ${result.success ? 'success' : 'error'}`}>
                        {result.success ? (
                            <>
                                <i className="fas fa-check-circle"></i>
                                <p>Login successful! Redirecting to admin dashboard...</p>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-exclamation-circle"></i>
                                <p>Login failed: {result.error}</p>
                            </>
                        )}
                    </div>
                )}

                <div className="manual-login">
                    <h3>Or manually go to:</h3>
                    <a href="/login" className="btn btn-secondary">
                        <i className="fas fa-user-lock"></i>
                        Regular Login Page
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginHelper;
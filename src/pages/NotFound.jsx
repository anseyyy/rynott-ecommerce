import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found-content">
                <img
                    src="https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1350&q=80"
                    alt="Lost illustration"
                    className="page-hero-image notfound-hero"
                />
                <div className="error-code">404</div>
                <h1>Page Not Found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <div className="error-actions">
                    <Link to="/" className="btn btn-primary">
                        Go Home
                    </Link>
                    <Link to="/products" className="btn btn-outline">
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
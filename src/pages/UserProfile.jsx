import React from 'react';
import { FaUser, FaCog, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import './UserProfile.css';

const UserProfile = () => {
    return (
        <div className="user-profile-page">
            <div className="container">
                <div className="user-profile-header">
                    <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
                        alt="User profile"
                        className="page-hero-image profile-hero"
                    />
                    <h1>User Profile</h1>
                    <p>Manage your account settings and preferences</p>
                </div>

                <div className="user-profile-content">
                    <FaUser className="user-profile-icon" />
                    <h2>Profile Management</h2>
                    <p>Your personal information and account settings will be available here once you set up your profile.</p>

                    <div className="user-profile-sections">
                        <div className="profile-section">
                            <FaUser className="section-icon" />
                            <h3>Personal Information</h3>
                            <p>Update your name, email, phone number, and other personal details</p>
                            <a href="#" className="btn btn-primary">Edit Profile</a>
                        </div>

                        <div className="profile-section">
                            <FaCog className="section-icon" />
                            <h3>Account Settings</h3>
                            <p>Manage your password, notification preferences, and privacy settings</p>
                            <a href="#" className="btn btn-primary">Manage Settings</a>
                        </div>

                        <div className="profile-section">
                            <FaHeart className="section-icon" />
                            <h3>Wishlist</h3>
                            <p>View and manage your favorite products across all categories</p>
                            <a href="#" className="btn btn-primary">View Wishlist</a>
                        </div>

                        <div className="profile-section">
                            <FaMapMarkerAlt className="section-icon" />
                            <h3>Addresses</h3>
                            <p>Manage your shipping and billing addresses for faster checkout</p>
                            <a href="#" className="btn btn-primary">Manage Addresses</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
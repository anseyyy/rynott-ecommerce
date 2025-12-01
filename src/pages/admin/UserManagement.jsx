import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiBaseUrl } from '../../services/serverURL';
import './UserManagement.css';

const UserManagement = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');

    // Fetch users
    const fetchUsers = async (page = 1, search = '', role = '') => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10'
            });

            if (search) params.append('search', search);
            if (role) params.append('role', role);

            const response = await fetch(`${apiBaseUrl}/users?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Backend returns data as an array of users directly
                setUsers(data.data || []);
                setCurrentPage(data.pagination?.page || page);
                setTotalPages(Math.ceil(data.total / 10) || 1);
            } else {
                setError(data.message || 'Failed to fetch users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Toggle user status (active/inactive)
    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const response = await fetch(`${apiBaseUrl}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isActive: !currentStatus
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Update the users state
                setUsers(users.map(user =>
                    user._id === userId
                        ? { ...user, isActive: data.data.isActive }
                        : user
                ));
            } else {
                setError(data.message || 'Failed to update user status');
            }
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Network error. Please try again.');
        }
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1, searchTerm, filterRole);
    };

    // Handle role filter
    const handleRoleFilter = (e) => {
        setFilterRole(e.target.value);
        fetchUsers(1, searchTerm, e.target.value);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading && users.length === 0) {
        return (
            <div className="user-management">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-management">
            <div className="user-management-header">
                <h1>User Management</h1>
                <p>Manage registered users and their account status</p>
            </div>

            {/* Search and Filter */}
            <div className="user-filters">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        Search
                    </button>
                </form>

                <select
                    value={filterRole}
                    onChange={handleRoleFilter}
                    className="role-filter"
                >
                    <option value="">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setError(null)} className="close-btn">
                        ×
                    </button>
                </div>
            )}

            {/* Users Table */}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {user.firstName?.[0]}{user.lastName?.[0]}
                                        </div>
                                        <div>
                                            <div className="user-name">
                                                {user.firstName} {user.lastName}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge ${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                                        className={`toggle-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                                        disabled={loading}
                                    >
                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && !loading && (
                    <div className="no-users">
                        <p>No users found.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => fetchUsers(currentPage - 1, searchTerm, filterRole)}
                        disabled={currentPage === 1 || loading}
                        className="pagination-btn"
                    >
                        Previous
                    </button>

                    <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => fetchUsers(currentPage + 1, searchTerm, filterRole)}
                        disabled={currentPage === totalPages || loading}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}

            {loading && users.length > 0 && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
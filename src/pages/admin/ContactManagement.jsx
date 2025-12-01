import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin, isAuthenticated } from '../../services/commonAPI';
import allAPI from '../../services/allAPI';
import './ContactManagement.css';

const ContactManagement = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [replyLoading, setReplyLoading] = useState(false);

    // Check authentication and admin role
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        fetchSubmissions();
    }, [filterStatus]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const filters = filterStatus !== 'all' ? { status: filterStatus } : {};
            const response = await allAPI.getContactSubmissions(filters);

            if (response.success) {
                setSubmissions(response.data);
            } else {
                setError(response.message || 'Failed to fetch submissions');
            }
        } catch (err) {
            setError('Failed to fetch contact submissions');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewSubmission = async (submissionId) => {
        try {
            const response = await allAPI.getContactSubmission(submissionId);

            if (response.success) {
                setSelectedSubmission(response.data);
            } else {
                setError(response.message || 'Failed to fetch submission');
            }
        } catch (err) {
            setError('Failed to fetch submission details');
            console.error('Error:', err);
        }
    };

    const handleStatusChange = async (submissionId, newStatus) => {
        try {
            const response = await allAPI.updateContactStatus(submissionId, newStatus);

            if (response.success) {
                setSubmissions(submissions.map(sub =>
                    sub._id === submissionId ? { ...sub, status: newStatus } : sub
                ));
                if (selectedSubmission?._id === submissionId) {
                    setSelectedSubmission({ ...selectedSubmission, status: newStatus });
                }
            } else {
                setError(response.message || 'Failed to update status');
            }
        } catch (err) {
            setError('Failed to update status');
            console.error('Error:', err);
        }
    };

    const handleSendReply = async () => {
        if (!replyMessage.trim()) {
            setError('Reply message cannot be empty');
            return;
        }

        try {
            setReplyLoading(true);
            const response = await allAPI.replyToContact(selectedSubmission._id, { message: replyMessage });

            if (response.success) {
                setSelectedSubmission(response.data);
                setReplyMessage('');
                setShowReplyModal(false);
                setError(null);
                await fetchSubmissions();
            } else {
                setError(response.message || 'Failed to send reply');
            }
        } catch (err) {
            setError('Failed to send reply');
            console.error('Error:', err);
        } finally {
            setReplyLoading(false);
        }
    };

    const handleDeleteSubmission = async (submissionId) => {
        if (!window.confirm('Are you sure you want to delete this submission?')) {
            return;
        }

        try {
            const response = await allAPI.deleteContactSubmission(submissionId);

            if (response.success) {
                setSubmissions(submissions.filter(sub => sub._id !== submissionId));
                if (selectedSubmission?._id === submissionId) {
                    setSelectedSubmission(null);
                }
                setError(null);
            } else {
                setError(response.message || 'Failed to delete submission');
            }
        } catch (err) {
            setError('Failed to delete submission');
            console.error('Error:', err);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner-large"></div>
                <p>Loading contact submissions...</p>
            </div>
        );
    }

    return (
        <div className="contact-management">
            <div className="management-header">
                <h1>Contact Form Submissions</h1>
                <p>Manage customer inquiries and responses</p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)} className="btn btn-small">
                        ×
                    </button>
                </div>
            )}

            <div className="filters-section">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Submissions</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div className="contact-management-content">
                <div className="submissions-list">
                    <h2>Submissions ({submissions.length})</h2>
                    {submissions.length === 0 ? (
                        <div className="no-submissions">
                            <p>No submissions found</p>
                        </div>
                    ) : (
                        <div className="submissions-table">
                            {submissions.map((submission) => (
                                <div
                                    key={submission._id}
                                    className={`submission-card ${submission.status}`}
                                    onClick={() => handleViewSubmission(submission._id)}
                                >
                                    <div className="submission-header">
                                        <div className="submission-info">
                                            <h4>{submission.subject}</h4>
                                            <p className="submission-from">{submission.name} ({submission.email})</p>
                                        </div>
                                        <span className={`status-badge ${submission.status}`}>
                                            {submission.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="submission-message">{submission.message.substring(0, 100)}...</p>
                                    <div className="submission-footer">
                                        <small>{new Date(submission.createdAt).toLocaleDateString()}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="submission-details">
                    {selectedSubmission ? (
                        <div className="details-card">
                            <div className="details-header">
                                <h3>{selectedSubmission.subject}</h3>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="close-btn"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="details-content">
                                <div className="detail-group">
                                    <label>From:</label>
                                    <p>{selectedSubmission.name} ({selectedSubmission.email})</p>
                                </div>

                                {selectedSubmission.phone && (
                                    <div className="detail-group">
                                        <label>Phone:</label>
                                        <p>{selectedSubmission.phone}</p>
                                    </div>
                                )}

                                <div className="detail-group">
                                    <label>Status:</label>
                                    <select
                                        value={selectedSubmission.status}
                                        onChange={(e) => handleStatusChange(selectedSubmission._id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="new">New</option>
                                        <option value="read">Read</option>
                                        <option value="replied">Replied</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>

                                <div className="detail-group">
                                    <label>Message:</label>
                                    <div className="message-box">
                                        {selectedSubmission.message}
                                    </div>
                                </div>

                                {selectedSubmission.reply && (
                                    <div className="detail-group reply-box">
                                        <label>Reply:</label>
                                        <div className="reply-content">
                                            <p>{selectedSubmission.reply.message}</p>
                                            <small>
                                                Sent by {selectedSubmission.reply.sentBy?.firstName} {selectedSubmission.reply.sentBy?.lastName} on{' '}
                                                {new Date(selectedSubmission.reply.sentAt).toLocaleString()}
                                            </small>
                                        </div>
                                    </div>
                                )}

                                <div className="details-actions">
                                    {!selectedSubmission.reply && (
                                        <button
                                            onClick={() => setShowReplyModal(true)}
                                            className="btn btn-primary"
                                        >
                                            Send Reply
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteSubmission(selectedSubmission._id)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="no-selection">
                            <p>Select a submission to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reply Modal */}
            {showReplyModal && selectedSubmission && (
                <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Send Reply</h2>
                            <button onClick={() => setShowReplyModal(false)} className="modal-close">×</button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendReply();
                            }}
                            className="reply-form"
                        >
                            <div className="form-group">
                                <label>Reply Message *</label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    rows="6"
                                    placeholder="Type your reply here..."
                                    required
                                />
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    onClick={() => setShowReplyModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={replyLoading}
                                >
                                    {replyLoading ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactManagement;

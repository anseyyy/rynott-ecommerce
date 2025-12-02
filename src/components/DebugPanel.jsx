import React from 'react';
import { serverUrl, apiBaseUrl } from '../services/serverURL';

const DebugPanel = () => {
    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 10000,
            maxWidth: '300px'
        }}>
            <h4>🔧 Debug Info</h4>
            <p><strong>Server URL:</strong> {serverUrl}</p>
            <p><strong>API Base URL:</strong> {apiBaseUrl}</p>
            <p><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</p>
            <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Present' : 'None'}</p>
            <p><strong>User:</strong> {localStorage.getItem('user') ? 'Logged in' : 'Not logged in'}</p>
        </div>
    );
};

export default DebugPanel;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentLogViewer = ({ sessionId, userId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    if (sessionId && userId) {
      fetchLogs();
    }
  }, [sessionId, userId]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/logs/${sessionId}/${userId}`);
      setLogs(response.data.logs || []);
    } catch (err) {
      setError('Failed to load student logs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadLogs = async () => {
    try {
      const response = await axios.get(`/api/logs/download/${sessionId}/${userId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `student_logs_${sessionId}_${userId}.log`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download logs');
    }
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `student_logs_${sessionId}_${userId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter logs based on search criteria
  const filteredLogs = logs.filter(log => {
    const matchesText = !filter || 
      log.action.toLowerCase().includes(filter.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(filter.toLowerCase());
    
    const matchesAction = !actionFilter || log.action === actionFilter;
    
    return matchesText && matchesAction;
  });

  // Get unique action types for filter dropdown
  const actionTypes = [...new Set(logs.map(log => log.action))].sort();

  if (loading) return <div className="loading">Loading student logs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-log-viewer">
      <div className="log-header">
        <h2>Student Activity Logs</h2>
        <p>Session: {sessionId} | Student: {userId}</p>
      </div>

      <div className="log-controls">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="search-input"
          />
          
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="action-filter"
          >
            <option value="">All Actions</option>
            {actionTypes.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>

        <div className="action-buttons">
          <button onClick={fetchLogs} className="refresh-btn">
            Refresh
          </button>
          <button onClick={downloadLogs} className="download-btn">
            Download Log File
          </button>
          <button onClick={exportAsJSON} className="export-btn">
            Export as JSON
          </button>
        </div>
      </div>
      
      <div className="log-stats">
        <p><strong>Total Logs:</strong> {logs.length}</p>
        <p><strong>Filtered:</strong> {filteredLogs.length}</p>
        <p><strong>Time Range:</strong> 
          {logs.length > 0 && (
            <>
              {new Date(logs[0]?.timestamp).toLocaleString()} - 
              {new Date(logs[logs.length - 1]?.timestamp).toLocaleString()}
            </>
          )}
        </p>
      </div>

      <div className="log-table-container">
        <table className="log-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Component</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index} className={`log-row ${log.action.replace('student_', '')}`}>
                <td className="timestamp">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="action">
                  <span className="action-badge">
                    {log.action.replace('student_', '')}
                  </span>
                </td>
                <td className="component">
                  {log.details.component || 'N/A'}
                </td>
                <td className="details">
                  <details>
                    <summary>View Details</summary>
                    <pre className="details-json">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .student-log-viewer {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .log-header {
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 10px;
        }
        
        .log-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .search-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .search-input, .action-filter {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
        }
        
        .action-buttons button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .refresh-btn { background: #4CAF50; color: white; }
        .download-btn { background: #2196F3; color: white; }
        .export-btn { background: #FF9800; color: white; }
        
        .log-stats {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .log-stats p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        .log-table-container {
          overflow-x: auto;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .log-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        
        .log-table th, .log-table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        .log-table th {
          background: #f8f9fa;
          font-weight: bold;
          position: sticky;
          top: 0;
        }
        
        .timestamp {
          white-space: nowrap;
          font-family: monospace;
        }
        
        .action-badge {
          background: #007bff;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
        }
        
        .details-json {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          font-size: 11px;
          overflow-x: auto;
          max-width: 300px;
        }
        
        .log-row.text_entry { background-color: #fff3cd; }
        .log-row.click { background-color: #d4edda; }
        .log-row.navigation { background-color: #d1ecf1; }
        .log-row.form_submit { background-color: #f8d7da; }
        
        .loading, .error {
          text-align: center;
          padding: 40px;
          font-size: 16px;
        }
        
        .error {
          color: #dc3545;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default StudentLogViewer;
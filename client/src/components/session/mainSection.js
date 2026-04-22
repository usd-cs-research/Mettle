import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionSocket } from '../../services/socket';
import { authContext } from '../../services/authContext.js';
import './session.css';

export default function SessionMainSection() {
    const [sessionID, setSessionID] = useState('');
    const [collaborationMode, setCollaborationMode] = useState('individual');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const apiurl = process.env.REACT_APP_API_URL;
    const { showPopup } = useContext(authContext);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Logout logic extracted for dropdown use
    const handleLogout = () => {
        localStorage.clear();
        showPopup('Logged out successfully', 'green');
        navigate('/login');
    };

    // Socket Handlers
    sessionSocket.on('connect_error', (error) => {
        showPopup('Connection error. Please check your network.', 'red');
    });

    sessionSocket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
            sessionSocket.connect();
        }
    });

    sessionSocket.on('joined', (data) => {
        showPopup('The other user has joined, You can continue', 'green');
    });

    const handleJoinSession = async (e) => {
        e.preventDefault();
        if (!sessionID) return showPopup('Please enter a session name', 'red');

        try {
            const response = await fetch(
                `${apiurl}/session/status?sessionName=${sessionID}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            );

            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            if (!data.sessionDetails) throw new Error('Session Does Not exist');

            const sessionId = data.sessionDetails._id;
            const sessionMode = data.sessionDetails.collaborationMode || 'individual';
            const currentUserId = localStorage.getItem('userId');
            const isCreator = data.sessionDetails.userOne?.userId === currentUserId;
            
            if (!isCreator) {
                if (sessionMode === 'collaborative' && collaborationMode === 'individual') {
                    throw new Error('Please select "Collaborative Work" to join this session.');
                }
                if (sessionMode === 'individual' && collaborationMode === 'collaborative') {
                    throw new Error('Please select "Individual Work" to join this session.');
                }
            }
            
            localStorage.setItem('collaborationMode', sessionMode);
            
            if (sessionMode === 'collaborative') {
                sessionSocket.connect();
                sessionSocket.emit('join', {
                    sessionName: sessionID,
                    userId: localStorage.getItem('userId'),
                });
                navigate(`/${sessionId}/roles`);
            } else {
                localStorage.setItem('role', 'Driver');
                localStorage.setItem('sessionId', sessionId);
                
                if (data.sessionDetails.questionId) {
                    localStorage.setItem('questionId', data.sessionDetails.questionId);
                    navigate(`/${sessionId}/problem`);
                } else {
                    navigate(`/${sessionId}/structure`);
                }
            }
        } catch (error) {
            showPopup(error.message, 'red');
        }
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        if (!sessionID) return showPopup('Please enter a session name', 'red');

        try {
            const response = await fetch(`${apiurl}/session/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    sessionName: sessionID,
                    collaborationMode: collaborationMode,
                }),
            });

            const responseData = await response.json();
            if (response.ok) {
                localStorage.setItem('collaborationMode', collaborationMode);
                localStorage.setItem('sessionId', responseData.sessionId);
                
                if (collaborationMode === 'collaborative') {
                    sessionSocket.connect();
                    sessionSocket.emit('join', {
                        sessionId: responseData.sessionId,
                        userId: localStorage.getItem('userId'),
                    });
                    navigate(`/${responseData.sessionId}/roles`);
                } else {
                    localStorage.setItem('role', 'Driver');
                    navigate(`/${responseData.sessionId}/structure`);
                }
            } else {
                throw new Error(responseData.message);
            }
        } catch (error) {
            showPopup(error.message, 'red');
        }
    };

    return (
        <div className="session--maincontent">
            {/* Header Dropdown - Complementary to light blue header */}
            
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <input
                        type="text"
                        id="sessionid"
                        className="session-input"
                        value={sessionID}
                        placeholder="Enter the group you want to create/Join"
                        onChange={(e) => setSessionID(e.target.value)}
                        required
                    />
                </div>
                
                <div className="work-mode-wrapper">
                    <label className="work-mode-label">Work Mode:</label>
                    <div className="work-mode-options">
                        <div 
                            className={`mode-card ${collaborationMode === 'individual' ? 'active' : ''}`}
                            onClick={() => setCollaborationMode('individual')}
                        >
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <span className="mode-text">Individual Work</span>
                        </div>

                        <div 
                            className={`mode-card ${collaborationMode === 'collaborative' ? 'active' : ''}`}
                            onClick={() => setCollaborationMode('collaborative')}
                        >
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                            <span className="mode-text">Collaborative Work</span>
                        </div>
                    </div>

                    <p className="mode-description">
                        {collaborationMode === 'individual' 
                            ? "Work independently without real-time collaboration" 
                            : "Work together with another student using Driver/Navigator roles"}
                    </p>
                </div>
                
                <div className="form-btn">
                    <button type="button" className="bttn-primary" onClick={handleJoinSession}>
                        Join Session
                    </button>
                    <button type="button" className="bttn-primary" onClick={handleCreateSession}>
                        Create Session
                    </button>
                </div>
            </form>
        </div>
    );
}

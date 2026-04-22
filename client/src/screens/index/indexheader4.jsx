import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../services/authContext.js';
import { sessionSocket } from '../../services/socket'; 
import './indexscreen.css';
import Header from '../../components/global/headerIcon';

export default function IndexHeader() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { showPopup, logout } = useContext(authContext);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear(); 
        sessionSocket.emit('exit-session');
        sessionSocket.disconnect();
        logout();
        showPopup('Logged out successfully', 'green');
        navigate('/'); 
    };

    return (
        <>
            {/* Wrapper to align items horizontally */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                position: 'relative',
                width: '100%',
                background: '#1a237e' // Matching your app's navy theme
            }}>
                <Header />
                
                {/* Dropdown Container forced to the right */}
                <div 
                    className="profile-dropdown-container" 
                    ref={dropdownRef}
                    style={{ 
                        marginRight: '20px', 
                        position: 'relative',
                        zIndex: 3000 // High z-index to stay above everything
                    }}
                >
                    <button 
                        className={`dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <svg className={`arrow ${isDropdownOpen ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="dropdown-card" style={{
                            position: 'absolute',
                            right: 0, // Align card to right edge of button
                            top: '100%',
                            marginTop: '10px',
                            background: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            borderRadius: '8px',
                            minWidth: '150px',
                            overflow: 'hidden'
                        }}>
                            <div className="dropdown-item logout-red" onClick={handleLogout} style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                color: '#d32f2f',
                                fontWeight: 'bold'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                <span>Log Out</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="idbottom">
                Here are some estimation problems for you to solve!
            </div>
        </>
    );
}
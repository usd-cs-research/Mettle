import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../services/authContext.js';
import { sessionSocket } from '../../services/socket'; // Import the socket service
import './indexscreen.css';

export default function IndexHeader() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    // Pull both showPopup and logout from the context
    const { showPopup, logout } = useContext(authContext);

    // Close dropdown on outside click
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
        // 1. Clear specific items or use clear()
        localStorage.clear(); 

        // 2. Perform Backend/Socket cleanup logic
        sessionSocket.emit('exit-session');
        sessionSocket.disconnect();

        // 3. Update Auth Context state
        logout();

        // 4. UI Feedback and Navigation
        showPopup('Logged out successfully', 'green');
        
        // Use '/' as per your first snippet, or '/login'
        navigate('/'); 
    };

    return (
        <>
            <div className="idheader">
                <span className="header-title">MEttLE</span>
                
                <div className="profile-dropdown-container" ref={dropdownRef}>
                    <button 
                        className={`dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <svg className={`arrow ${isDropdownOpen ? 'open' : ''}`} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="dropdown-card">
                            <div className="dropdown-item problems-blue" onClick={() => { navigate('/history'); setIsDropdownOpen(false); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span>Solved Problems</span>
                            </div>
                            <div className="dropdown-item logout-red" onClick={handleLogout}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                <span>Log Out</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="idbottom">
                Modeling-Based Estimation Learning Environment 
            </div>
        </>
    );
}
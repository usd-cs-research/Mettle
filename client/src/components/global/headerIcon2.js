import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../services/authContext.js';
import { sessionSocket } from '../../services/socket'; // Import the socket service
import driverPng from '../../assets/images/steering-wheel.png';
import navigatorPng from '../../assets/images/navigator-compass.png';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    // Pull both showPopup and logout from the context
    const { showPopup, logout } = useContext(authContext);

    // Role Logic
    const role = localStorage.getItem('role');
    const roleData =
        role === 'Driver'
            ? 'You are currently the Driver so you are the one who interacts with the page and submits inputs.'
            : 'You are currently the Navigator so you have to discuss with the driver and cannot interact with the page.';

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

    // Logout logic from the second code
    const handleLogout = () => {
        // 1. Clear storage
        localStorage.clear(); 

        // 2. Perform Backend/Socket cleanup logic
        sessionSocket.emit('exit-session');
        sessionSocket.disconnect();

        // 3. Update Auth Context state
        logout();

        // 4. UI Feedback and Navigation
        showPopup('Logged out successfully', 'green');
        navigate('/'); 
    };

    return (
        <header>
            <div className="idheader" style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                padding: "0 0px",
                
            }}>
                {/* Left Section: Role Icon */}
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <img
                        className="hoverable-image"
                        src={role === 'Driver' ? driverPng : navigatorPng}
                        title={roleData}
                        alt="Role"
                        style={{ height: '40px', width: '40px' }}
                    />
                </div>

                {/* Center Section: Title */}
                <div>
                    MEttLE
                </div>

                {/* Right Section: Logout Dropdown */}
                <div style={{ display: "flex", justifyContent: "flex-end", flex: 1,marginBottom:"30px" }}>
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
                            <div className="dropdown-item logout-red" onClick={handleLogout}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                <span>Log Out</span>
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </header>
    );
}

import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../services/socket';
import { authContext } from '../../services/authContext';

import driverPng from '../../assets/images/steering-wheel.png';
import navigatorPng from '../../assets/images/navigator-compass.png';
import infocenterPng from '../../assets/images/info.png';
import problemmapPng from '../../assets/images/map.png';
import scribblepadPng from '../../assets/images/scribble.png';
import videoPng from '../../assets/images/video.png';

import '../../screens/problem/problemscreens.css';

export default function ProblemHeader({ children }) {
    const { sessionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { switchRole, logout, showPopup } = useContext(authContext);
    const role = localStorage.getItem('role');
    const [sidebarMode, setSidebarMode] = useState(() => {
        return localStorage.getItem('problemSidebarMode') || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('problemSidebarMode', sidebarMode);
    }, [sidebarMode]);

    const persistProblemMapSelection = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const problemIndex = pathSegments.indexOf('problem');
        const selectedPiece = problemIndex >= 0 ? pathSegments[problemIndex + 1] : null;
        const validPieces = new Set([
            'functional',
            'qualitative',
            'quantitative',
            'calculation',
            'evaluation',
        ]);

        if (validPieces.has(selectedPiece)) {
            sessionStorage.setItem(
                `problem-map-selection-${sessionId}`,
                selectedPiece,
            );
            return;
        }

        if (
            location.pathname === `/${sessionId}/problem/` ||
            location.pathname.endsWith('/problem')
        ) {
            return;
        }

        sessionStorage.removeItem(`problem-map-selection-${sessionId}`);
    };

    // --- Backend Logic Keepers ---
    const handleAction = (type) => {
        let path = '';
        let event = '';
        switch (type) {
            case 'info':
                path = `/${sessionId}/problem/infocentre`;
                event = 'problem-redirect-infocentre';
                break;
            case 'scribble':
                path = `/${sessionId}/problem/notes`;
                event = 'problem-redirect-notepad';
                break;
            case 'map':
                path = `/${sessionId}/problem/`;
                event = 'problem-redirect-problemmap';
                break;
            case 'estimation':
                path = `/${sessionId}/problem/aboutproblem`;
                event = 'problem-redirect-aboutproblem';
                break;
            default: break;
        }
        if (path) {
            if (type === 'map') {
                persistProblemMapSelection();
            }
            navigate(path);
            sessionSocket.emit('forward', { sessionId, eventDesc: event });
        }
    };

    const changeRole = () => {
        sessionSocket.emit('role-switch', { sessionId });
        role === 'Navigator' ? switchRole('Driver') : switchRole('Navigator');
    };

    const exitSession = () => {
        sessionSocket.emit('exit-session');
        sessionSocket.disconnect();
        localStorage.removeItem('questionId');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('role');
        navigate('/intro');
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionSocket.emit('exit-session');
        sessionSocket.disconnect();
        logout();
        showPopup('Logged out successfully', 'green');
        navigate('/');
    };

    const roleData = role === 'Driver' 
        ? 'You are currently the Driver so you are the one who interacts with the page and submits inputs.' 
        : 'You are currently the Navigator so you have to discuss with the driver and cannot interact with the page.';

    const isDarkMode = sidebarMode === 'dark';
    const sidebarStyles = isDarkMode
        ? {
              background: 'linear-gradient(180deg, #161b46 0%, #0f1333 100%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '10px 0 28px rgba(5, 8, 28, 0.32)',
          }
        : {
              background: '#f8f9fa',
              borderRight: '1px solid #e0e0e0',
              boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
          };

    const workspaceTitleStyles = isDarkMode
        ? {
              color: 'rgba(255, 255, 255, 0.96)',
              textShadow: '0 0 18px rgba(255, 255, 255, 0.18)',
          }
        : {
              color: '#1a237e',
              textShadow: 'none',
          };

    const dividerStyles = isDarkMode
        ? { border: '0.5px solid rgba(255, 255, 255, 0.14)' }
        : { border: '0.5px solid rgba(26, 35, 126, 0.1)' };

    const navButtonStyles = isDarkMode
        ? {
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: '0 0 18px rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              color: 'rgba(255, 255, 255, 0.94)',
              iconFilter: 'brightness(0) invert(1)',
              hoverBackground: 'rgba(255, 255, 255, 0.2)',
              hoverBorder: 'rgba(255, 255, 255, 0.42)',
              hoverShadow: '0 0 24px rgba(255, 255, 255, 0.16)',
              textShadow: '0 0 12px rgba(255, 255, 255, 0.1)',
          }
        : {
              background: '#ffffff',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              backdropFilter: 'none',
              color: '#455a64',
              iconFilter: 'none',
              hoverBackground: '#f0f4ff',
              hoverBorder: '#1a237e',
              hoverShadow: '0 6px 18px rgba(26, 35, 126, 0.08)',
              textShadow: 'none',
          };

    const activeNavStyles = isDarkMode
        ? {
              background: 'rgba(255, 255, 255, 0.24)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 0 26px rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              textShadow: '0 0 14px rgba(255, 255, 255, 0.18)',
          }
        : {
              background: '#eef3ff',
              border: '1px solid #1a237e',
              boxShadow: '0 8px 18px rgba(26, 35, 126, 0.12)',
              color: '#1a237e',
              textShadow: 'none',
          };

    return (
        <div
            className="problem-layout"
            data-sidebar-mode={sidebarMode}
            style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                inset: 0,
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                background: isDarkMode ? '#0f1230' : '#f4f6fb',
            }}
        >
            <header
                className="idheader"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '0 18px',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 20,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    <div style={{ flexShrink: 0 }}>
                        <img
                            className="hoverable-image"
                            src={role === 'Driver' ? driverPng : navigatorPng}
                            title={roleData}
                            alt="Role"
                            style={{
                                cursor: 'help',
                                height: '40px',
                                filter: 'brightness(0) invert(1) drop-shadow(0 8px 14px rgba(15, 23, 42, 0.24))',
                                opacity: 0.92,
                            }}
                        />
                    </div>

                    <div
                        style={{
                            flex: 1,
                            minWidth: 0,
                            textAlign: 'center',
                            fontSize: '20px',
                            color: 'white',
                            paddingLeft: '16px',
                        }}
                    >
                        MEttLE: Modeling-Based Estimation Learning Environment
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
                        backdropFilter: 'blur(10px)',
                        flexShrink: 0,
                    }}
                >
                    <ModeButton
                        label="Light"
                        active={!isDarkMode}
                        onClick={() => setSidebarMode('light')}
                    />
                    <ModeButton
                        label="Dark"
                        active={isDarkMode}
                        onClick={() => setSidebarMode('dark')}
                    />
                </div>
            </header>

            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    minHeight: 0,
                }}
            >
                {/* LEFT: Permanent Navigation Bar */}
                <nav
                    className="problem-layout__sidebar"
                    style={{
                        width: '220px',
                        minWidth: '220px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '0 12px 16px',
                        zIndex: 10,
                        ...sidebarStyles,
                    }}
                >
                    <div style={{ marginBottom: '20px', padding: '10px 8px 0' }}>
                        <h3
                            style={{
                                margin: 0,
                                fontSize: '1.05rem',
                                fontWeight: 'bold',
                                letterSpacing: '0.02em',
                                ...workspaceTitleStyles,
                            }}
                        >
                            Workspace
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                        <NavBlock
                            icon={infocenterPng}
                            label="Info Centre"
                            onClick={() => handleAction('info')}
                            theme={navButtonStyles}
                            activeTheme={activeNavStyles}
                            isActive={location.pathname.includes('/problem/infocentre')}
                        />
                        <NavBlock
                            icon={scribblepadPng}
                            label="Scribble Pad"
                            onClick={() => handleAction('scribble')}
                            theme={navButtonStyles}
                            activeTheme={activeNavStyles}
                            isActive={location.pathname.includes('/problem/notes')}
                        />
                        <NavBlock
                            icon={problemmapPng}
                            label="Problem Map"
                            onClick={() => handleAction('map')}
                            theme={navButtonStyles}
                            activeTheme={activeNavStyles}
                            isActive={
                                location.pathname === `/${sessionId}/problem/` ||
                                location.pathname.endsWith('/problem')
                            }
                        />
                        <NavBlock
                            icon={videoPng}
                            label="Estimation Guide"
                            onClick={() => handleAction('estimation')}
                            theme={navButtonStyles}
                            activeTheme={activeNavStyles}
                            isActive={location.pathname.includes('/problem/aboutproblem')}
                        />
                        
                        <hr
                            style={{
                                width: '100%',
                                margin: '8px 0',
                                ...dividerStyles,
                            }}
                        />

                        <button 
                            className="nav-action-btn" 
                            onClick={changeRole} 
                            disabled={role === 'Navigator'}
                            style={{ 
                                background: role === 'Navigator'
                                    ? isDarkMode
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : '#eef1f4'
                                    : isDarkMode
                                        ? 'rgba(255, 255, 255, 0.16)'
                                        : 'rgba(26, 35, 126, 0.05)', 
                                color: role === 'Navigator'
                                    ? isDarkMode
                                        ? 'rgba(255, 255, 255, 0.45)'
                                        : '#90a4ae'
                                    : isDarkMode
                                        ? '#ffffff'
                                        : '#1a237e',
                                border: isDarkMode
                                    ? '1px solid rgba(255, 255, 255, 0.22)'
                                    : '1px solid rgba(26, 35, 126, 0.18)',
                                boxShadow: isDarkMode
                                    ? '0 0 18px rgba(255, 255, 255, 0.08)'
                                    : '0 4px 14px rgba(26, 35, 126, 0.06)',
                                backdropFilter: isDarkMode ? 'blur(12px)' : 'none',
                            }}
                        >
                            Switch Role
                        </button>

                        <button 
                            className="nav-action-btn" 
                            onClick={exitSession}
                            disabled={role === 'Navigator'}
                            style={{ 
                                background: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#fff5f5',
                                color: isDarkMode ? '#f5d6d6' : '#c62828',
                                border: isDarkMode
                                    ? '1px solid rgba(255, 255, 255, 0.2)'
                                    : '1px solid #ffcdd2',
                                boxShadow: isDarkMode
                                    ? '0 0 18px rgba(255, 255, 255, 0.08)'
                                    : '0 4px 14px rgba(198, 40, 40, 0.06)',
                                backdropFilter: isDarkMode ? 'blur(12px)' : 'none',
                            }}
                        >
                            Exit Session
                        </button>

                        <button 
                            className="nav-action-btn" 
                            onClick={handleLogout}
                            style={{ 
                                background: isDarkMode ? 'rgba(255, 255, 255, 0.22)' : '#1a237e',
                                color: 'white', 
                                border: isDarkMode
                                    ? '1px solid rgba(255, 255, 255, 0.28)'
                                    : 'none',
                                boxShadow: isDarkMode
                                    ? '0 0 22px rgba(255, 255, 255, 0.14)'
                                    : '0 4px 6px rgba(26, 35, 126, 0.2)',
                                backdropFilter: isDarkMode ? 'blur(14px)' : 'none',
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                </nav>

                <div
                    className="problem-layout__main"
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        background: isDarkMode
                            ? 'linear-gradient(180deg, #14183b 0%, #0f1230 100%)'
                            : '#fff',
                    }}
                >
                    <main
                        className="problem-layout__content"
                        style={{ flex: 1, overflowY: 'auto', padding: '20px' }}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

// NavBlock component styled like the "Menu Button"
const NavBlock = ({ icon, label, onClick, theme, activeTheme, isActive }) => (
    <div 
        onClick={onClick}
        data-active={isActive ? 'true' : 'false'}
        style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            padding: '10px 12px',
            borderRadius: '10px', 
            cursor: 'pointer', 
            transition: 'all 0.2s',
            background: isActive ? activeTheme.background : theme.background,
            border: isActive ? activeTheme.border : theme.border,
            boxShadow: isActive ? activeTheme.boxShadow : theme.boxShadow,
            backdropFilter: theme.backdropFilter,
        }}
        onMouseEnter={(e) => {
            if (isActive) {
                return;
            }
            e.currentTarget.style.background = theme.hoverBackground;
            e.currentTarget.style.borderColor = theme.hoverBorder;
            e.currentTarget.style.boxShadow = theme.hoverShadow;
        }}
        onMouseLeave={(e) => {
            if (isActive) {
                e.currentTarget.style.background = activeTheme.background;
                e.currentTarget.style.borderColor = activeTheme.border.replace('1px solid ', '');
                e.currentTarget.style.boxShadow = activeTheme.boxShadow;
                return;
            }
            e.currentTarget.style.background = theme.background;
            e.currentTarget.style.borderColor = theme.border.replace('1px solid ', '');
            e.currentTarget.style.boxShadow = theme.boxShadow;
        }}
    >
        <img
            src={icon}
            alt={label}
            style={{
                width: '18px',
                height: '18px',
                filter: theme.iconFilter,
                opacity: 0.95,
            }}
        />
        <span
            style={{
                fontWeight: '600',
                color: isActive ? activeTheme.color : theme.color,
                fontSize: '13px',
                textShadow: isActive ? activeTheme.textShadow : theme.textShadow,
            }}
        >
            {label}
        </span>
    </div>
);

const ModeButton = ({ label, active, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            borderRadius: '999px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: active ? '#100d47' : 'rgba(255, 255, 255, 0.88)',
            background: active ? 'rgba(255, 255, 255, 0.96)' : 'transparent',
            boxShadow: active ? '0 6px 14px rgba(255, 255, 255, 0.18)' : 'none',
            transition: 'all 0.2s ease',
        }}
    >
        {label}
    </button>
);

import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';

const authContext = createContext({
  isAuthenticated: false,
  token: null,
  type: 'student',
  role: '',
  userId: '',
  newToken: () => {},
  login: () => {},
  logout: () => {},
  setType: () => {},
  setUserId: () => {},
  setRole: () => {},
  validSession: () => {},
  switchRole: () => {},
  showPopup: () => {},
});

export { authContext };

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedValue = localStorage.getItem('isAuthenticated');
    return storedValue ? JSON.parse(storedValue) : false;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token');
  });
  const [type, setType] = useState(() => {
    return localStorage.getItem('type') || 'student';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role') || null;
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });
  const [sessionId, setSessionId] = useState(null);
  const [popupBool, setPopupBool] = useState(false);
  const [popupData, setPopupData] = useState(false);
  const popupTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem('type', type);
  }, [type]);

  useEffect(() => {
    localStorage.setItem('role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('userId', userId);
  }, [userId]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setSessionId(null);
  };

  const newToken = (newToken) => {
    setToken(newToken);
  };

  const validSession = (sessionId, role) => {
    setSessionId(sessionId);
    setRole(role);
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('role', newRole);
  };

  const clearPopupTimer = useCallback(() => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
      popupTimerRef.current = null;
    }
  }, [popupTimerRef]);

  const showPopup = useCallback(
    (message, type) => {
      setPopupData({
        message: message,
        type: type,
      });
      setPopupBool(true);

      clearPopupTimer();
      popupTimerRef.current = setTimeout(() => {
        setPopupBool(false);
        popupTimerRef.current = null;
      }, 3000);
    },
    [clearPopupTimer]
  );

  useEffect(() => () => clearPopupTimer(), [clearPopupTimer]);

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        token,
        type,
        role,
        userId,
        sessionId,
        login,
        logout,
        newToken,
        setType,
        setRole,
        setUserId,
        setSessionId,
        validSession,
        switchRole,
        showPopup,
        popupData,
        popupBool,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;

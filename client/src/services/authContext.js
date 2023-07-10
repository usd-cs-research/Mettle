import React, { createContext, useState, useEffect } from 'react';

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

	useEffect(() => {
		localStorage.setItem(
			'isAuthenticated',
			JSON.stringify(isAuthenticated),
		);
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
	};

	const newToken = (newToken) => {
		setToken(newToken);
	};

	const validSession = (sessionId) => {
		setSessionId(sessionId);
	};

	return (
		<authContext.Provider
			value={{
				isAuthenticated,
				token,
				type,
				role,
				userId,
				login,
				logout,
				newToken,
				setType,
				setRole,
				setUserId,
			}}
		>
			{children}
		</authContext.Provider>
	);
};

export default AuthProvider;

import React, { createContext, useState } from 'react';

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
});

export { authContext };

const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [token, setToken] = useState(null);
	const [type, setType] = useState('student');
	const [role, setRole] = useState(null);
	const [userId, setUserId] = useState(null);

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

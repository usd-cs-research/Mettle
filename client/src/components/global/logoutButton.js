import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { authContext } from '../../services/authContext';

export default function LogoutButton() {
	const navigate = useNavigate();

	const { logout } = useContext(authContext);

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('type');
		localStorage.removeItem('userId');
		localStorage.removeItem('role');
		logout();
		navigate('/');
	};

	return (
		<button className="default--button" onClick={handleLogout}>
			Log Out
		</button>
	);
}

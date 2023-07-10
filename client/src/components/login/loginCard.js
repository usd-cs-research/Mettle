import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../../services/authContext.js';
import { useContext } from 'react';

function LoginCard() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { newToken, login, setType, setUserId } = useContext(authContext);

	const [loginSuccess, setLoginSuccess] = useState(false);

	const apiurl = process.env.REACT_APP_API_URL;

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = {
			email,
			password,
		};

		try {
			const response = await fetch(`${apiurl}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error('Login failed');
			}

			const responseData = await response.json();
			localStorage.setItem('token', responseData.token);
			localStorage.setItem('type', responseData.designation);
			localStorage.setItem('userId', responseData.userId);
			localStorage.setItem('isAuthenticated', true);

			newToken(responseData.token);
			setType(responseData.designation);
			setUserId(responseData.userId);
			login();

			setLoginSuccess(true);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="login-card">
			{loginSuccess && <Navigate to="/" />}

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input
						type="email"
						id="email"
						value={email}
						placeholder="email"
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						id="password"
						placeholder="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit">Login</button>
			</form>
		</div>
	);
}

export default LoginCard;

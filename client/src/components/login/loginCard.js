import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginCard() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

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
			localStorage.setItem('userID', responseData.user);
			navigate('/intro');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="login-card">
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

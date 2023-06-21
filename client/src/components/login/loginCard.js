import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginCard() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		const data = {
			email,
			password,
		};

		fetch(`http://localhost:5000/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Login failed');
				}
				return response.json();
			})
			.then((data) => {
				console.log(data);
				// Assuming you are using the React Router navigate function
				navigate('/intro');
			})
			.catch((error) => {
				console.error(error);
			});
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

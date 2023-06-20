import React, { useState } from 'react';

function LoginCard() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		// Create the payload for the POST request
		const data = {
			email,
			password,
		};

		// Make the POST request
		fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				// Handle the response data
				console.log(data);
			})
			.catch((error) => {
				// Handle the error
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

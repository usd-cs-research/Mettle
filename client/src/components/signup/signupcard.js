import React, { useState } from 'react';

function SignupCard() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		adminKey: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Create the payload for the POST request
		const data = {
			name: formData.name,
			email: formData.email,
			password: formData.password,
			confirmPassword: formData.confirmPassword,
			adminKey: formData.adminKey,
		};

		// Make the POST request
		fetch('/signup', {
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
		<div className="signup-card">
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input
						type="text"
						id="name"
						name="name"
						placeholder="Name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="email"
						id="email"
						placeholder="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						id="confirmPassword"
						placeholder="Confirm Password"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="text"
						placeholder="Admin Key"
						id="adminKey"
						name="adminKey"
						value={formData.adminKey}
						onChange={handleChange}
					/>
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

export default SignupCard;

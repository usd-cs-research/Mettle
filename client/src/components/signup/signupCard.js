import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupCard() {
	const navigate = useNavigate();
	const apiurl = process.env.REACT_APP_API_URL;

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

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			console.error('Password and Confirm Password do not match');
			return;
		}

		const data = {
			name: formData.name,
			email: formData.email,
			password: formData.password,
			confirmPassword: formData.confirmPassword,
			adminKey: formData.adminKey,
			designation: 'student',
		};

		try {
			const response = await fetch(`${apiurl}/signup`, {
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
			console.log(responseData);
			navigate('/login');
		} catch (error) {
			console.error(error);
		}
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

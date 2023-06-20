import React, { useState } from 'react';

export default function SessionMainSection() {
	const [sessionID, setSessionID] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		// Create the payload for the POST request
		const data = sessionID;

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
		<>
			<div className="info">
				<p>Let's Start!</p>
			</div>
			<div className="session--maincontent">
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<input
							type="text"
							id="sessionid"
							value={sessionID}
							placeholder="Enter the group you want to create/Join"
							onChange={(e) => setSessionID(e.target.value)}
							required
						/>
					</div>
					<button type="submit">Commence Sesion</button>
				</form>
				<div class="line-with-or">
					<div class="line"></div>
					<span class="or">or</span>
					<div class="line"></div>
				</div>
				<button className="default--button" id="prev--solved--btn">
					Yout Previously Solved Problems
				</button>
				<button className="default--button">Log Out</button>
			</div>
		</>
	);
}

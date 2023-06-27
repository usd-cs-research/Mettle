import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../global/logoutButton';

export default function SessionMainSection() {
	const [sessionID, setSessionID] = useState('');
	const apiurl = process.env.REACT_APP_API_URL;

	const navigate = useNavigate();

	const handleJoinSession = async (e) => {
		e.preventDefault();

		const data = sessionID;

		try {
			const response = await fetch(`${apiurl}/session/join`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `${localStorage.getItem('token')}`,
				},
				body: data,
			});

			const responseData = await response.json();
			console.log(responseData);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCreateSession = async (e) => {
		e.preventDefault();

		const data = sessionID;
		console.log(data);

		try {
			const response = await fetch(`${apiurl}/session/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({
					sessionName: data,
				}),
			});

			const responseData = await response.json();
			console.log(responseData);
		} catch (error) {
			console.error(error);
		}
	};

	const handlePreviousButton = () => {
		navigate('/history');
	};

	return (
		<>
			<div className="info">
				<p>Let's Start!</p>
			</div>
			<div className="session--maincontent">
				<form>
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
					<div className="form-buttons">
						<button type="submit" onClick={handleJoinSession}>
							Join Session
						</button>
						<button type="submit" onClick={handleCreateSession}>
							Create Session
						</button>
					</div>
				</form>
				<div className="line-with-or">
					<div className="line"></div>
					<span className="or">or</span>
					<div className="line"></div>
				</div>
				<button
					onClick={handlePreviousButton}
					className="default--button"
					id="prev--solved--btn"
				>
					Yout Previously Solved Problems
				</button>
				<LogoutButton />
			</div>
		</>
	);
}

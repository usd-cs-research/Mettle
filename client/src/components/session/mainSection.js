import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../global/logoutButton';
import { sessionSocket } from '../../services/socket';

export default function SessionMainSection() {
	const [sessionID, setSessionID] = useState('');
	const apiurl = process.env.REACT_APP_API_URL;

	const navigate = useNavigate();

	sessionSocket.on('connect', () => {
		console.log('Socket Connected');
	});

	sessionSocket.on('connect_error', (error) => {
		console.error('Session socket connection error:', error);
	});

	// Add a disconnect handler to listen for disconnections
	sessionSocket.on('disconnect', () => {
		console.log('Session socket disconnected');
	});

	sessionSocket.on('joined', (data) => {
		console.log('JOINEDEVENT', data);
	});

	const handleJoinSession = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`${apiurl}/session/status?sessionId=${sessionID}`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem(
							'token',
						)}`,
					},
				},
			);

			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();

			console.log(data);
		} catch (error) {
			alert(error);
		}

		sessionSocket.connect();
		sessionSocket.emit('join', {
			sessionId: sessionID,
			userId: localStorage.getItem('userId'),
		});
		navigate(`/${sessionID}/roles`);
	};

	const handleCreateSession = async (e) => {
		e.preventDefault();

		const data = sessionID;

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

			if (response.ok) {
				const responseData = await response.json();
				sessionSocket.connect();

				sessionSocket.emit('join', {
					sessionId: responseData.sessionId,
					userId: localStorage.getItem('userId'),
				});

				localStorage.setItem('sessionId', responseData.sessionId);

				navigate(`/${responseData.sessionId}/roles`);
			}
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

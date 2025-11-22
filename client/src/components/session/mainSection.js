import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../global/logoutButton';
import { sessionSocket } from '../../services/socket';
import { authContext } from '../../services/authContext.js';
import { useContext } from 'react';

export default function SessionMainSection() {
	const [sessionID, setSessionID] = useState('');
	const [collaborationMode, setCollaborationMode] = useState('individual'); // New state
	const apiurl = process.env.REACT_APP_API_URL;
	const { showPopup } = useContext(authContext);

	const navigate = useNavigate();

	sessionSocket.on('connect', () => {
		// Socket connected successfully
	});

	sessionSocket.on('connect_error', (error) => {
		// Handle connection errors
		showPopup('Connection error. Please check your network.', 'red');
	});

	// Add a disconnect handler to listen for disconnections
	sessionSocket.on('disconnect', (reason) => {
		// Socket disconnected
		if (reason === 'io server disconnect') {
			// Server disconnected the socket, try to reconnect
			sessionSocket.connect();
		}
	});

	sessionSocket.on('joined', (data) => {
		showPopup('The other user has joined, You can continue', 'green');
	});

	const handleJoinSession = async (e) => {
		e.preventDefault();

		let sessionId = '';

		try {
			const response = await fetch(
				`${apiurl}/session/status?sessionName=${sessionID}`,
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

		if (!data.sessionDetails) {
			throw new Error('Session Does Not exist');
		}

		if (data.sessionDetails) {
			sessionId = data.sessionDetails._id;
			const sessionMode = data.sessionDetails.collaborationMode || 'individual';
			const currentUserId = localStorage.getItem('userId');
			const isCreator = data.sessionDetails.userOne?.userId === currentUserId;
			
			// ✅ Allow creator to join with any mode, validate others
			if (!isCreator) {
				if (sessionMode === 'collaborative' && collaborationMode === 'individual') {
					throw new Error('Cannot join a collaborative session in individual mode. Please select "Collaborative Work" to join this session.');
				}
				
				if (sessionMode === 'individual' && collaborationMode === 'collaborative') {
					throw new Error('Cannot join an individual session in collaborative mode. Please select "Individual Work" to join this session.');
				}
			}
			
			// Store collaboration mode
			localStorage.setItem('collaborationMode', sessionMode);
			
			// Only connect socket if collaborative mode
			if (sessionMode === 'collaborative') {
				sessionSocket.connect();
				sessionSocket.emit('join', {
					sessionName: sessionID,
					userId: localStorage.getItem('userId'),
				});
				navigate(`/${sessionId}/roles`);
			} else {
				// Individual mode: skip roles and go to appropriate page
				localStorage.setItem('role', 'Driver');
				localStorage.setItem('sessionId', sessionId);
				
				if (data.sessionDetails.questionId) {
					// Question already selected, go directly to problem
					localStorage.setItem('questionId', data.sessionDetails.questionId);
					navigate(`/${sessionId}/problem`);
				} else {
					// No question selected, go to select problem
					navigate(`/${sessionId}/selectproblem`);
				}
			}
		}
		} catch (error) {
			showPopup(error.message, 'red');
		}
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
					collaborationMode: collaborationMode, // Send collaboration mode
				}),
			});

			if (response.ok) {
				const responseData = await response.json();
				
				// Store collaboration mode
				localStorage.setItem('collaborationMode', collaborationMode);
				localStorage.setItem('sessionId', responseData.sessionId);
				
			// Only connect socket if collaborative mode
			if (collaborationMode === 'collaborative') {
				sessionSocket.connect();
				sessionSocket.emit('join', {
					sessionId: responseData.sessionId,
					userId: localStorage.getItem('userId'),
				});
				navigate(`/${responseData.sessionId}/roles`);
			} else {
				// Individual mode: skip roles and structure, go directly to select problem
				localStorage.setItem('role', 'Driver');
				navigate(`/${responseData.sessionId}/selectproblem`);
			}
			} else {
				const responseObject = await response.json();
				throw new Error(responseObject.message);
			}
		} catch (error) {
			showPopup(error.message, 'red');
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
					
					{/* Collaboration Mode Selection */}
					<div className="form-group" style={{marginTop: '20px', marginBottom: '20px'}}>
						<label style={{display: 'block', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold'}}>
							Work Mode:
						</label>
						<div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
							<label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
								<input
									type="radio"
									name="collaborationMode"
									value="individual"
									checked={collaborationMode === 'individual'}
									onChange={(e) => setCollaborationMode(e.target.value)}
									style={{marginRight: '8px'}}
								/>
								<span>Individual Work</span>
							</label>
							<label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
								<input
									type="radio"
									name="collaborationMode"
									value="collaborative"
									checked={collaborationMode === 'collaborative'}
									onChange={(e) => setCollaborationMode(e.target.value)}
									style={{marginRight: '8px'}}
								/>
								<span>Collaborative Work (Driver/Navigator)</span>
							</label>
						</div>
						{collaborationMode === 'individual' && (
							<p style={{fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center'}}>
								Work independently without real-time collaboration
							</p>
						)}
						{collaborationMode === 'collaborative' && (
							<p style={{fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center'}}>
								Work together with another student using Driver/Navigator roles
							</p>
						)}
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
					Your Previously Solved Problems
				</button>
				<LogoutButton />
			</div>
		</>
	);
}

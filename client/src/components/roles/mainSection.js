import React, { useState } from 'react';
import navigatorImg from '../../assets/images/navigator-compass.png';
import driverImg from '../../assets/images/steering-wheel.png';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import LogoutButton from '../global/logoutButton';
import { sessionSocket } from '../../services/socket';
import { authContext } from '../../services/authContext.js';
import { useContext } from 'react';

export default function RolesMainSection() {
	const { sessionId } = useParams();
	const apiurl = process.env.REACT_APP_API_URL;
	const { validSession, showPopup } = useContext(authContext);
	const collaborationMode = localStorage.getItem('collaborationMode') || 'individual';

	const navigate = useNavigate();

	const continueFunction = async () => {
		try {
			const response = await fetch(
				`${apiurl}/session/status?sessionId=${sessionId}`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem(
							'token',
						)}`,
					},
				},
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}

		console.log(data);

		// ✅ Skip offline check for individual mode (no second user needed)
		if (collaborationMode === 'collaborative' && data.status === 'offline') {
			throw new Error(
				'The session is offline. Waiting for other user',
			);
		}

		// ✅ Set role based on mode: collaborative uses userRole from backend, individual always 'Driver'
		if (collaborationMode === 'individual') {
			// Individual mode: always Driver role
			validSession(sessionId, 'Driver');
			localStorage.setItem('sessionId', sessionId);
			localStorage.setItem('role', 'Driver');
		} else {
			// Collaborative mode: use assigned roles from backend
			if (data.session.userOne.userId === localStorage.getItem('userId')) {
				validSession(
					sessionId,
					data.session.userOne.userRole,
				);
				localStorage.setItem('sessionId', sessionId);
				localStorage.setItem('role', data.session.userOne.userRole);
			}
			if (data.session.userTwo?.userId === localStorage.getItem('userId')) {
				validSession(
					sessionId,
					data.session.userTwo.userRole,
				);
				localStorage.setItem('sessionId', sessionId);
				localStorage.setItem('role', data.session.userTwo.userRole);
			}
		}
		
		if (data.session.questionId) {
			localStorage.setItem('questionId', data.session.questionId);
			// Both modes go to problem when questionId exists
			navigate(`/${sessionId}/problem`);
		} else {
			// No question selected: collaborative goes to structure, individual goes to selectproblem
			if (collaborationMode === 'individual') {
				navigate(`/${sessionId}/selectproblem`);
			} else {
				navigate(`/${sessionId}/structure`);
			}
		}
		} catch (error) {
			showPopup(`${error.message}`, 'red');
		}
	};

	const continueHandler = async () => {
		await continueFunction();
		
		// Only emit socket event if collaborative mode
		if (collaborationMode === 'collaborative') {
			sessionSocket.emit('forward', {
				eventDesc: 'roles--continue',
				sessionId: sessionId,
			});
		}
	};

	// Only listen for socket events in collaborative mode
	if (collaborationMode === 'collaborative') {
		sessionSocket.on('forward', (data) => {
			if (data.eventDesc === 'roles--continue') {
				continueFunction();
			}
		});
	}

	return (
		<>
			<div className="info">
				<p>{collaborationMode === 'individual' ? 'Individual Mode' : 'Two Different Roles'}</p>
			</div>
			<div className="roles--maincontent">
				{collaborationMode === 'individual' ? (
					<>
						<h3>Individual Work Mode</h3>
						<div className="role--details">
							<span style={{textAlign: 'center', fontSize: '16px', padding: '20px'}}>
								<strong>You are working independently!</strong><br/><br/>
								✅ Full control over all interactions<br/>
								✅ Can click, type, and submit answers<br/>
								✅ No waiting for other users<br/>
								✅ Work at your own pace<br/><br/>
								Proceed to start working on the problem.
							</span>
						</div>
					</>
				) : (
					<>
						<h3>Driver</h3>
						<div className="role--details">
							<div className="role--details--img">
								<img src={driverImg} alt="driver" />
							</div>
							<span>
								The driver is the one that can interact with the page:
								enter text, click on buttons and submit the answers. The
								purpose of the driver is to listen and share ideas with
								the navigator.
							</span>
						</div>
						<h3>Navigator</h3>
						<div className="role--details">
							<span>
								The navigator is the one that will help the driver
								navigate through the exercise, sharing ideas and
								opinions. He cannot interact directly with the page and
								need the help of the driver for this.
							</span>
							<div className="role--details--img">
								<img src={navigatorImg} alt="navigator" />
							</div>
						</div>
						<div className="roles--extra-info">
							<span>
								To know which role is assigned to you, check the icon on
								the top left part of the page after commencing a
								session. The steering wheel will indicate that you are
								the Driver, and the compass will indicate that you are
								the Navigator. Keep in mind that roles swap when you
								visit new pages, and revert when you come back to
								previously visited pages.
							</span>
						</div>
					</>
				)}
				<button className="default--button" onClick={continueHandler}>
					Continue
				</button>
				<LogoutButton />
			</div>
		</>
	);
}

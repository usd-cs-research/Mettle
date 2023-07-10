import React from 'react';
import navigatorImg from '../../assets/images/navigator-compass.png';
import driverImg from '../../assets/images/steering-wheel.png';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from '../global/logoutButton';
import { sessionSocket } from '../../services/socket';

export default function RolesMainSection() {
	const sessionId = useLocation().pathname.replace('/roles', '');
	const apiurl = process.env.REACT_APP_API_URL;

	const navigate = useNavigate();

	const continueHandler = async () => {
		try {
			const response = await fetch(
				`${apiurl}/session/status?sessionId=${sessionId.replace(
					'/',
					'',
				)}`,
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

			if (data.status === 'offline') {
				throw new Error('The session is offline');
			}

			sessionSocket.emit('forward', {
				sessionId: sessionId.replace('/', ''),
			});
			navigate(`${sessionId}/structure`);
		} catch (error) {
			alert(error);
		}
	};

	sessionSocket.on('forward', () => {
		navigate(`${sessionId}/structure`);
	});

	return (
		<>
			<div className="info">
				<p>Two Different Roles</p>
			</div>
			<div className="roles--maincontent">
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
				<button className="default--button" onClick={continueHandler}>
					Continue
				</button>
				<LogoutButton />
			</div>
		</>
	);
}

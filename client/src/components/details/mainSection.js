import React from 'react';
import DiagramComponent from './diagramComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import { sessionSocket } from '../../services/socket';

export default function DetailsMainSection() {
	const sessionId = useLocation().pathname.replace('/details', '');
	const navigate = useNavigate();
	const role = localStorage.getItem('role');

	const continueHandler = () => {
		sessionSocket.emit('forward', {
			eventDesc: 'driver--details--beginsolving',
			sessionId: sessionId.replace('/', ''),
		});
		navigate(`${sessionId}/selectproblem`);
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'driver--details--beginsolving') {
			navigate(`${sessionId}/selectproblem`);
		}
	});

	return (
		<>
			<div className="info">
				<p>
					Here is a map showing the sub-goals of an example problem.
					Click on any of the sub-goals to see its tasks and
					double-click to hide the tasks!
				</p>
			</div>
			<div className="diagram-component--container">
				<DiagramComponent />
			</div>
			<button
				className="default--button"
				onClick={continueHandler}
				disabled={role === 'Navigator'}
			>
				Click here to Begin Solving!
			</button>
		</>
	);
}

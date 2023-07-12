import React from 'react';
import ReactPlayer from 'react-player';
import video from '../../assets/videos/problem_overview.mp4';
import { useNavigate, useLocation } from 'react-router-dom';
import { sessionSocket } from '../../services/socket';

export default function ProblemStructureMainSection() {
	const navigate = useNavigate();
	const sessionId = useLocation().pathname.replace('/structure', '');
	const role = localStorage.getItem('role');

	const handleLearnMore = () => {
		navigate(`${sessionId}/details`);
		sessionSocket.emit('forward', {
			eventDesc: 'driver--structure--learnmore',
			sessionId: sessionId.replace('/', ''),
		});
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'driver--structure--learnmore') {
			navigate(`${sessionId}/details`);
		}
	});

	return (
		<>
			<div className="info">
				<p>How do we solve Estimation Problems?!</p>
			</div>
			<div className="problemstructure--maincontent">
				<div className="video-container">
					<ReactPlayer url={video} controls={true} />
				</div>
			</div>
			<button
				className="default--button"
				onClick={handleLearnMore}
				disabled={role === 'Navigator'}
			>
				Click Here to Learn More
			</button>
		</>
	);
}

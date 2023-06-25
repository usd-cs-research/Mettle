import React from 'react';
import ReactPlayer from 'react-player';
import video from '../../assets/videos/problem_overview.mp4';
import { useNavigate } from 'react-router-dom';

export default function ProblemStructureMainSection() {
	const navigate = useNavigate();

	const handleLearnMore = () => {
		navigate('/details');
	};
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
			<button className="default--button" onClick={handleLearnMore}>
				Click Here to Learn More
			</button>
		</>
	);
}

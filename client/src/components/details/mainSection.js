import React from 'react';
import DiagramComponent from './diagramComponent';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DetailsMainSection() {
	const sessionId = useLocation().pathname.replace('/details', '');

	const navigate = useNavigate();

	const continueHandler = () => {
		navigate(`${sessionId}/selectproblem`);
	};
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
			<button className="default--button" onClick={continueHandler}>
				Click here to Begin Solving!
			</button>
		</>
	);
}

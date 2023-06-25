import React from 'react';
import DiagramComponent from './diagramComponent';

export default function DetailsMainSection() {
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
		</>
	);
}

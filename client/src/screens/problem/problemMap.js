import React from 'react';
import ProblemHeader from '../../components/problem/problemHeader';
import DiagramComponent from '../../components/details/diagramComponent';
import MyMenu from '../../components/problem/myMenu';

export default function ProblemMapScreen() {
	return (
		<>
			<ProblemHeader />
			<div className="info">
				<p className="col-lg-8 problem-info">
					Here's a map of this sub-problem. Click on any of the
					sub-goals to begin solving the problem.
				</p>
				<MyMenu />
			</div>
			<DiagramComponent />
		</>
	);
}

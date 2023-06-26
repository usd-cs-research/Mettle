import React from 'react';

export default function ProblemCard(props) {
	return (
		<div className="problem--card">
			<div className="problem--statement">
				<span>{props.data.question}</span>
			</div>
			<img src={props.data.imgUrl} alt="problem picture"></img>
			<button className="default--button">Begin Solving!</button>
		</div>
	);
}

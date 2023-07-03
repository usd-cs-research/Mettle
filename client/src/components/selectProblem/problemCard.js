import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProblemCard(props) {
	const navigate = useNavigate();
	const editHandler = () => {
		navigate('/createproblem');
	};

	const beginHandler = () => {
		navigate(`${props.sessionId}/problem`);
	};

	console.log(props.sessionId);
	return (
		<div className="problem--card">
			<div className="problem--statement">
				<span>{props.data.question}</span>
			</div>
			<img src={props.data.imgUrl} alt="problem"></img>
			{props.type === 'student' && (
				<button className="default--button" onClick={beginHandler}>
					Begin Solving!
				</button>
			)}
			{props.type === 'teacher' && (
				<button className="default--button" onClick={editHandler}>
					Edit Question
				</button>
			)}
		</div>
	);
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionSocket } from '../../services/socket';

export default function ProblemCard(props) {
	const navigate = useNavigate();
	const apiurl = process.env.REACT_APP_API_URL;
	const editHandler = () => {
		const questionId = props.data.id;
		navigate(`/question/${questionId}`);
	};
	

	const beginHandler = async (event) => {
		const questionId = event.target.id;
		try {
			await fetch(`${apiurl}/session/addQuestion`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({
					sessionId: `${localStorage.getItem('sessionId')}`,
					questionId: questionId,
				}),
			});
		} catch (error) {
			console.log(error);
		}

		sessionSocket.emit('forward', {
			eventDesc: 'selectproblem-beginsolving',
			sessionId: props.sessionId.replace('/', ''),
			state: 'problem-redirect',
		});

		navigate(`${props.sessionId}/problem`);
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'selectproblem-beginsolving') {
			navigate(`/${data.sessionId}/problem`);
		}
	});

	return (
		<div className="problem--card">
			<div className="problem--statement">
				<span>{props.data.question}</span>
			</div>
			<div className="problemcard-image">
				<img
					src={props.data.imgurl}
					id={props.data.imgurl}
					alt="problem"
				/>
			</div>
			{props.type === 'student' && (
				<button
					className="default--button"
					onClick={beginHandler}
					id={props.data.id}
					disabled={props.role === 'Navigator'}
				>
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

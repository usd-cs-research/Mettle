import React from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionSocket } from '../../services/socket';

export default function ProblemCard(props) {
	const navigate = useNavigate();
	const apiurl = process.env.REACT_APP_API_URL;
	const editHandler = () => {
		navigate('/createproblem');
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
		sessionSocket.emit('state-change', {
			eventDesc: 'selectproblem-beginsolving',
			sessionId: props.sessionId.replace('/', ''),
			state: 'problem-redirect',
		});

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
			<img src={props.data.imgUrl} alt="problem"></img>
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

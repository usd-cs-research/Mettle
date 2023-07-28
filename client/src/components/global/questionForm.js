import React, { useEffect, useState } from 'react';
import { sessionSocket } from '../../services/socket';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { authContext } from '../../services/authContext.js';
import { useContext } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';

export default function QuestionForm({
	questionData,
	answerData,
	setAnswerData,
	type,
	subtype,
}) {
	const role = localStorage.getItem('role');
	const { sessionId } = useParams();
	const apiurl = process.env.REACT_APP_API_URL;
	const [hintObject, setHintObject] = useState({});
	const { showPopup } = useContext(authContext);

	const handleSubmit = async () => {
		try {
			const response = await fetch(`${apiurl}/answer`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({
					sessionId: sessionId,
					type: `${type}`,
					subtype: `${subtype}`,
					answers: answerData,
				}),
			});

			if (response.ok) {
				showPopup('Responses Saved', 'green');
			}
		} catch (error) {
			showPopup(error.message || 'Error', 'red');
		}
	};

	const handleChange = (event) => {
		const data = event.target.value;
		const id = event.target.name;

		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: `${type}${subtype}-answer-typing`,
			value: {
				...answerData,
				[id]: data,
			},
		});

		setAnswerData({
			...answerData,
			[id]: data,
		});
	};

	const handleHint = (event) => {
		const id = event.target.id;

		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: `${type}${subtype}-hint-button`,
			value: {
				...hintObject,
				[id]: !hintObject[id],
			},
		});

		setHintObject({
			...hintObject,
			[id]: !hintObject[id],
		});
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === `${type}${subtype}-answer-typing`) {
			setAnswerData(data.value);
		}

		if (data.eventDesc === `${type}${subtype}-hint-button`) {
			setHintObject(data.value);
		}
	});

	return (
		<div
			style={{
				height: 'auto',
				width: '550px',
				borderStyle: 'groove',
				padding: '20px',
			}}
		>
			<div
				className="mini-questions-container"
				style={{ marginTop: '17px' }}
			>
				{
					<>
						{Object.keys(questionData).length > 0 ? (
							questionData.questions.map((question, key) => {
								const questionKey = `question${key}`;
								return (
									<div key={question._id}>
										<label className="mini-question">
											{question.question}
										</label>
										<br />
										<a
											style={{
												color: 'blue',
												cursor: 'pointer',
											}}
											onClick={handleHint}
											id={question._id}
										>
											{hintObject[question._id]
												? 'Hide'
												: 'Show'}{' '}
											Hint
										</a>
										<br />
										{hintObject[question._id] && (
											<label className="mini-question-hint">
												hint: <em>{question.hint}</em>
											</label>
										)}
										<input
											name={question._id}
											id={questionKey}
											onChange={handleChange}
											disabled={role === 'Navigator'}
											value={
												answerData[question?._id] || ''
											} // Retrieve the value from answerData using question._id as the key
										/>
									</div>
								);
							})
						) : (
							<p>Loading question data...</p>
						)}
					</>
				}

				<button
					type="button"
					class="btn btn-primary btn-sm editable-submit"
					disabled={role === 'Navigator'}
					onClick={handleSubmit}
				>
					<AiOutlineCheck />
				</button>
			</div>
		</div>
	);
}

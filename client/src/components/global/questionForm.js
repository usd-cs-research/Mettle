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
		<div className="question-form-card">
			<div className="question-form-card__header">
				<p className="question-form-card__eyebrow">Response Space</p>
				<h3 className="question-form-card__title">
					Work through each prompt
				</h3>
			</div>
			<div className="mini-questions-container question-form-fields">
				{
					<>
						{Object.keys(questionData).length > 0 ? (
							questionData.questions.map((question, key) => {
								const questionKey = `question${key}`;
								return (
									<div key={question._id} className="question-form-field">
										<label className="mini-question">
											{question.question}
										</label>
										<button
											type="button"
											className="question-form-hint-toggle"
											onClick={handleHint}
											id={question._id}
										>
											{hintObject[question._id]
												? 'Hide'
												: 'Show'}{' '}
											Hint
										</button>
										{hintObject[question._id] && (
											<label className="mini-question-hint question-form-hint">
												hint: <em>{question.hint}</em>
											</label>
										)}
										<textarea
											className="question-form-textarea"
											rows={5}
											cols={40}
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
							<p className="question-form-loading">Loading question data...</p>
						)}
					</>
				}

				<button
					type="button"
					className="problem-action-button problem-action-button--primary editable-submit"
					disabled={role === 'Navigator'}
					onClick={handleSubmit}
				>
					<AiOutlineCheck /> Save Response
				</button>
			</div>
		</div>
	);
}

import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import SubQuestionDiagramComponent from '../../../components/problem/subqDiagramComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../../services/socket';
import { AiOutlineCheck } from 'react-icons/ai';
import { authContext } from '../../../services/authContext.js';
import { useContext } from 'react';

const evaluatemapquestions = [
	{
		question:
			'What steps did I take to calculate the estimate? What was the goal of each step? ',
		hint: 'none',
		_id: '1',
	},
	{
		question:
			'Why did I need to do all these steps? How did each step contribute towards solving the problem? ',
		hint: 'none',
		_id: '2',
	},
	{
		question:
			'Why did I do these steps in this sequence? Could there have been a better sequence to solve the problem? ',
		hint: 'none',
		_id: '3',
	},
	{
		question:
			'Which was the most important step in the estimation process?',
		hint: 'none',
		_id: '4',
	},
	{
		question: 'Which step can I remove from the estimation process?',
		hint: 'none',
		_id: '5',
	},
];

export default function EvaluationMapScreen() {
	const { sessionId } = useParams();
	const role = localStorage.getItem('role');
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});
	const [answerData, setAnswerData] = useState({});
	const navigate = useNavigate();
	const [hintObject, setHintObject] = useState({});
	const { showPopup } = useContext(authContext);

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await fetch(
					`${apiurl}/question/sub?questionId=${localStorage.getItem(
						'questionId',
					)}&tag=evaluation&subtype=evaluation`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				);

				const res2 = await fetch(
					`${apiurl}/answer/type?sessionId=${sessionId}&type=evaluation&subtype=map`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				);

				const data = await res.json();
				data.questions = evaluatemapquestions;
				const data2 = await res2.json();
				console.log(data2);
				setQuestionData(data);

				if (data2.answers.length > 0) {
					setAnswerData(data2?.answers[0]);
				}
			} catch (error) {
				showPopup(error.message || 'Error', 'red');
			}
		};

		getData();
	}, []);

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
					type: 'evaluation',
					subtype: 'map',
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
			eventDesc: `evaluationmap-answer-typing`,
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

	const handleSubmitData = () => {
		showPopup(
			'Congratulations! You have completed the question successfully!! You can exit the session now',
			'green',
		);

		sessionSocket.emit('forward', {
			eventDesc: 'evaluationmap--submit',
			sessionId: sessionId,
		});
	};

	const handleHint = (event) => {
		const id = event.target.id;

		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: `evaluationmap-hint-button`,
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
		if (data.eventDesc === 'evaluationmap-answer-typing') {
			setAnswerData(data.value);
		}

		if (data.eventDesc === 'evaluationmap--navigate') {
			navigate(data.path);
		}

		if (data.eventDesc === 'evaluationmap--submit') {
			showPopup(
				'Congratulations! You have completed the question successfully!! You can exit the session now',
				'green',
			);
		}

		if (data.eventDesc === `evaluationmap-hint-button`) {
			setHintObject(data.value);
		}
	});

	return (
		<>
			<ProblemHeader />
			<div
				className="info"
				style={{ height: 'fit-content', padding: '5px' }}
			>
				<p className="col-lg-8 problem-info">
					{
						'Congratulations! You have obtained a reasonable estimate of the required power. Think of the sequence of tasks that you performed to get a reasonable estimate. Then answer the questions below.'
					}
				</p>
				<MyMenu question={questionData.mainQuestion || ''} />
			</div>
			<section id="middlepart">
				<div class="register">
					<div class="container-fluid">
						<div
							class="row activity"
							style={{ textAlign: 'center' }}
						>
							<div class="col-lg-6" style={{ marginTop: '50px' }}>
								<SubQuestionDiagramComponent
									sessionId={sessionId}
								/>
							</div>
							<div class="col-lg-6" style={{ marginTop: '30px' }}>
								<div
									style={{
										height: 'auto',
										width: '550px',
										borderStyle: 'groove',
									}}
								>
									<div
										className="mini-questions-container"
										style={{ marginTop: '17px' }}
									>
										{
											<>
												{Object.keys(questionData)
													.length > 0 ? (
													questionData.questions.map(
														(question, key) => {
															const questionKey = `question${key}`;
															return (
																<div
																	key={
																		question._id
																	}
																>
																	<label className="mini-question">
																		{
																			question.question
																		}
																	</label>
																	<br />
																	<a
																		style={{
																			color: 'blue',
																			cursor: 'pointer',
																		}}
																		onClick={
																			handleHint
																		}
																		id={
																			question._id
																		}
																	>
																		{hintObject[
																			question
																				._id
																		]
																			? 'Hide'
																			: 'Show'}{' '}
																		Hint
																	</a>
																	<br />
																	{hintObject[
																		question
																			._id
																	] && (
																		<label className="mini-question-hint">
																			hint:{' '}
																			<em>
																				{
																					question.hint
																				}
																			</em>
																		</label>
																	)}
																	<textarea
																		rows={5}
																		cols={
																			40
																		}
																		name={
																			question._id
																		}
																		id={
																			questionKey
																		}
																		onChange={
																			handleChange
																		}
																		disabled={
																			role ===
																			'Navigator'
																		}
																		value={
																			answerData[
																				question
																					._id
																			] ||
																			''
																		} // Retrieve the value from answerData using question._id as the key
																	/>
																</div>
															);
														},
													)
												) : (
													<p>
														Loading question data...
													</p>
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
								<div
									class="medium_margin subtask_text"
									style={{ width: '550px' }}
								>
									<button
										style={{
											float: 'left',
										}}
										onClick={handleSubmitData}
										class="btn btn-info"
										id="problem1funcevalcheck_back"
										disabled={role === 'Navigator'}
									>
										Submit and Complete
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import SubQuestionDiagramComponent from '../../../components/problem/subqDiagramComponent';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../../services/socket';
import { AiOutlineCheck } from 'react-icons/ai';
import { authContext } from '../../../services/authContext.js';
import { useContext } from 'react';
import PromptModal from './promptModal';

export default function FunctionalEvaluateCheckScreen() {
	const { sessionId } = useParams();
	const role = localStorage.getItem('role');
	const loc = useLocation();
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});
	const [answerData, setAnswerData] = useState({});
	const navigate = useNavigate();
	const { showPopup } = useContext(authContext);
	const [hintObject, setHintObject] = useState({});
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await fetch(
					`${apiurl}/question/sub?questionId=${localStorage.getItem(
						'questionId',
					)}&tag=functional&subtype=evaluatecheck`,
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
					`${apiurl}/answer/type?sessionId=${sessionId}&type=functional&subtype=evaluatecheck`,
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
				const data2 = await res2.json();
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
					type: 'functional',
					subtype: 'evaluatecheck',
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
			eventDesc: `funcevalcheck-answer-typing`,
			value: {
				...answerData,
				[id]: data,
			},
		});
		console.log(id, data);

		setAnswerData({
			...answerData,
			[id]: data,
		});
	};

	const identifyActions = () => {
		const path = loc.pathname
			.replace('evaluate', 'model')
			.replace('check', 'main');

		sessionSocket.emit('forward', {
			eventDesc: 'funcevaluatecheck--navigate',
			sessionId: sessionId,
			path: path,
		});

		navigate(path);
	};

	const dominantActions = () => {
		const path = loc.pathname.replace('check', 'dominant');

		sessionSocket.emit('forward', {
			eventDesc: 'funcevaluatecheck--navigate',
			sessionId: sessionId,
			path: path,
		});

		navigate(path);
	};

	const handleYesClick = () => {
		sessionSocket.emit('forward', {
			eventDesc: 'funcevaluatecheck--clickyes',
			sessionId: sessionId,
		});

		showPopup(
			'You have included all critical actions, you can move on to identifying dominant actions',
			'green',
		);
	};

	const handleNoClick = () => {
		sessionSocket.emit('forward', {
			eventDesc: 'funcevaluatecheck--clickno',
			sessionId: sessionId,
		});

		setShowModal(true);

		showPopup(
			'You have not included all critical actions, fill this prompt and go back to the model screen',
			'red',
		);
	};

	const handleHint = (event) => {
		const id = event.target.id;

		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: `functionalevalcheck-hint-button`,
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
		if (data.eventDesc === 'funcevalcheck-answer-typing') {
			setAnswerData(data.value);
		}

		if (data.eventDesc === 'funcevaluatecheck--navigate') {
			navigate(data.path);
		}

		if (data.eventDesc === 'funcevaluatecheck--clickyes') {
			showPopup(
				'You have included all critical actions, you can move on to identifying dominant actions',
				'green',
			);
		}

		if (data.eventDesc === 'funcevaluatecheck--clickno') {
			showPopup(
				'You have not included all critical actions, fill this prompt and go back to the model screen',
				'red',
			);

			setShowModal(true);
		}

		if (data.eventDesc === `functionalevalcheck-hint-button`) {
			setHintObject(data.value);
		}
	});

	return (
		<>
			<ProblemHeader />
			<div className="info">
				<p className="col-lg-8 problem-info">
					{questionData.subQuestion || ''}
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
									subpart="functional"
									minipart="evaluate"
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

															// Check if it's the last question
															const isLastQuestion =
																key ===
																questionData
																	.questions
																	.length -
																	1;

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
																	{/* Use a different input element for the last question */}
																	{isLastQuestion ? (
																		// Use a different input element here (e.g., <textarea> or <select>)
																		<>
																			<button
																				class="btn"
																				style={{
																					backgroundColor:
																						'#ccc',
																					margin: '5px',
																				}}
																				onClick={
																					handleYesClick
																				}
																				disabled={
																					role ===
																					'Navigator'
																				}
																			>
																				Yes
																			</button>
																			<button
																				class="btn"
																				style={{
																					backgroundColor:
																						'#ccc',
																				}}
																				onClick={
																					handleNoClick
																				}
																				disabled={
																					role ===
																					'Navigator'
																				}
																			>
																				No
																			</button>
																		</>
																	) : (
																		// Use the default <input> element for other questions
																		<input
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
																			}
																		/>
																	)}
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
										onClick={identifyActions}
										class="btn btn-info"
										id="problem1funcevalcheck_back"
										disabled={role === 'Navigator'}
									>
										Go back to identify actions
									</button>

									<button
										style={{
											float: 'right',
											color: '#333',
											textDecoration: 'none',
											borderRadius: '4px',
											backgroundColor: '#ccc',
										}}
										class="btn"
										disabled={role === 'Navigator'}
										onClick={dominantActions}
									>
										Identify Dominant Actions
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				{showModal && <PromptModal />}
			</section>
		</>
	);
}

import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import SubQuestionDiagramComponent from '../../../components/problem/subqDiagramComponent';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../../services/socket';
import { AiOutlineCheck } from 'react-icons/ai';
import { authContext } from '../../../services/authContext.js';
import { useContext } from 'react';

export default function EvaluationEvaluationScreen() {
	const { sessionId } = useParams();
	const role = localStorage.getItem('role');
	const loc = useLocation();
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});
	const [answerData, setAnswerData] = useState({});
	const navigate = useNavigate();
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
					`${apiurl}/answer/type?sessionId=${sessionId}&type=evaluation&subtype=evaluation`,
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
					type: 'evaluation',
					subtype: 'evaluation',
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
			eventDesc: `evaluation-answer-typing`,
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

	const handleSubmitData = () => {
		const path = loc.pathname.replace('evaluate', 'model');

		// sessionSocket.emit('forward', {
		// 	eventDesc: 'evaluation--navigate',
		// 	sessionId: sessionId,
		// 	path: path,
		// });

		// navigate(path);
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'evaluation-answer-typing') {
			setAnswerData(data.value);
		}

		if (data.eventDesc === 'evaluation--navigate') {
			navigate(data.path);
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
									subpart="evaluation"
									minipart="evaluation"
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
																	<label className="mini-question-hint">
																		hint:{' '}
																		<em>
																			{
																				question.hint
																			}
																		</em>
																	</label>
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
										Submit
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

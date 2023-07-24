import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import { sessionSocket } from '../../../services/socket';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';
import SubQuestionDiagramComponent from '../../../components/problem/subqDiagramComponent';

export default function FunctionalModelPromptsScreen() {
	const role = localStorage.getItem('role');
	const [answerData, setAnswerData] = useState({});
	const { sessionId } = useParams();
	const loc = useLocation();
	const navigate = useNavigate();
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});

	useEffect(() => {
		const getData = async () => {
			const res = await fetch(
				`${apiurl}/question/sub?questionId=${localStorage.getItem(
					'questionId',
				)}&tag=functional&subtype=modelprompts`,
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
			setQuestionData(data);
			console.log(data);
		};

		getData();
	}, []);

	const handlePrevious = () => {
		const path = loc.pathname.replace('prompts', 'main');
		console.log(path);

		sessionSocket.emit('forward', {
			eventDesc: 'modelprompts--navigate--modelmain',
			sessionId: sessionId,
			path: path,
		});

		navigate(path);
	};

	const handleChange = (event) => {
		const data = event.target.value;
		const id = event.target.id;

		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: `modelprompts-answer-typing`,
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

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'modelprompts-answer-typing') {
			setAnswerData(data.value);
		}

		if (data.eventDesc === 'modelprompts--navigate--modelmain') {
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
									subpart="functional"
									minipart="model"
									sessionId={sessionId}
								/>
							</div>
							<div class="col-lg-6" style={{ marginTop: '30px' }}>
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
																				questionKey
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
										>
											<AiOutlineCheck />
										</button>
										<button
											type="button"
											class="btn btn-default btn-sm editable-cancel"
											style={{
												color: ' #333',
												backgroundColor: '#fff',
												borderColor: '#ccc',
												margin: '5px',
											}}
											disabled={role === 'Navigator'}
										>
											<MdClose />
										</button>
									</div>
								</div>
								<div
									class="medium_margin subtask_text"
									style={{ width: '550px' }}
								>
									<button
										style={{
											float: 'right',
											margin: '10px',
										}}
										class="btn btn-info"
										id="problem1funcmodelprompts_back"
										disabled={role === 'Navigator'}
										onClick={handlePrevious}
									>
										Go back and edit your list of actions
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

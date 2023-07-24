import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import SubQuestionDiagramComponent from '../../../components/problem/subqDiagramComponent';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../../services/socket';
import { MdClose } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';

export default function QuantitativeModelScreen() {
	const { sessionId } = useParams();
	const role = localStorage.getItem('role');
	const loc = useLocation();
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});
	const [answerData, setAnswerData] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		const getData = async () => {
			const res = await fetch(
				`${apiurl}/question/sub?questionId=${localStorage.getItem(
					'questionId',
				)}&tag=quantitative&subtype=model`,
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

	const handleChange = (event) => {
		const data = event.target.value;
		const id = event.target.id;

		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: `quanmodel-answer-typing`,
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

	const qualitativeEval = () => {
		const path = loc.pathname.replace('model', 'evaluate/check');

		sessionSocket.emit('forward', {
			eventDesc: 'quanmodel--navigate',
			sessionId: sessionId,
			path: path,
		});

		navigate(path);
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'quanmodel-answer-typing') {
			setAnswerData(data.value);
		}

		if (data.eventDesc === 'quanmodel--navigate') {
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
									subpart="quantitative"
									minipart="model"
									sessionId={sessionId}
								/>
							</div>
							<div
								class="col-lg-6"
								style={{
									display: 'flex',
									marginTop: '30px',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
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
									<div
										class="medium_margin subtask_text"
										style={{ width: '550px' }}
									>
										<button
											class="btn  btn-info"
											disabled={role === 'Navigator'}
											onClick={qualitativeEval}
										>
											Check to see if the equation is
											complete
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

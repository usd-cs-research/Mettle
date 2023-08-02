import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import SubQuestionDiagramComponent from '../../../components/problem/subqDiagramComponent';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../../services/socket';
import { AiOutlineCheck } from 'react-icons/ai';
import { authContext } from '../../../services/authContext.js';
import { useContext } from 'react';
import CalculationTable from '../../../components/problem/calculationTable';

export default function CalculationCalculationScreen() {
	const { sessionId } = useParams();
	const role = localStorage.getItem('role');
	const loc = useLocation();
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});
	const [answerData, setAnswerData] = useState({});
	const [tableData, setTableData] = useState([]);
	const navigate = useNavigate();
	const { showPopup } = useContext(authContext);

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await fetch(
					`${apiurl}/question/sub?questionId=${localStorage.getItem(
						'questionId',
					)}&tag=calculation&subtype=calculation`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				);

				// const res2 = await fetch(
				// 	`${apiurl}/answer/type?sessionId=${sessionId}&type=calculation&subtype=calculation`,
				// 	{
				// 		headers: {
				// 			'Content-Type': 'application/json',
				// 			Authorization: `Bearer ${localStorage.getItem(
				// 				'token',
				// 			)}`,
				// 		},
				// 	},
				// );

				const data = await res.json();
				// const data2 = await res2.json();
				setQuestionData(data);
				// if (data2.answers.length > 0) {
				// 	setAnswerData(data2?.answers[0]);
				// }
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
					type: 'calculation',
					subtype: 'calculation',
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
			eventDesc: `calculation-answer-typing`,
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

	const navEvaluate = () => {
		const path = loc.pathname
			.replace('calculation', 'evaluation')
			.replace('calculation', 'evaluation');

		sessionSocket.emit('forward', {
			eventDesc: 'calculation--navigate',
			sessionId: sessionId,
			path: path,
		});

		navigate(path);
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'calculation-answer-typing') {
			setAnswerData(data.value);
		}

		if (data.eventDesc === 'calculation--navigate') {
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
									subpart="calculation"
									minipart="calculation"
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
									<CalculationTable
										tableData={tableData}
										setTableData={setTableData}
									/>
									<div
										className="mini-questions-container"
										style={{ marginTop: '17px' }}
									>
										{
											<>
												<div
													style={{
														marginBottom: '30px',
														marginTop: '30px',
													}}
												>
													<label className="mini-question">
														Calculate the estimate
														and enter the value
														here. You may use the
														Calculator to calculate.
													</label>

													<input
														name="calculationAnswer"
														id={'calculationAnswer'}
														onChange={handleChange}
														disabled={
															role === 'Navigator'
														}
														value={
															answerData[
																'calculationAnswer'
															]
														} // Retrieve the value from answerData using question._id as the key
													/>
												</div>
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
											float: 'right',
											color: '#333',
											textDecoration: 'none',
											borderRadius: '4px',
											backgroundColor: '#ccc',
										}}
										class="btn"
										disabled={role === 'Navigator'}
										onClick={navEvaluate}
									>
										Click to evaluate your estimated value
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

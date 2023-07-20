import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import { sessionSocket } from '../../../services/socket';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function FunctionalModelPromptsScreen() {
	const role = localStorage.getItem('role');
	const [answerData, setAnswerData] = useState({});
	const { sessionId } = useParams();
	const loc = useLocation();
	const navigate = useNavigate();
	const apiurl = process.env.REACT_APP_API_URL;

	useEffect(() => {
		const getData = async () => {
			const res = await fetch(
				`${apiurl}/question/sub?questionId=${localStorage.getItem(
					'questionId',
				)}&tag=functional&subtype=model`,
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
			console.log(data);
		};

		getData();
	});

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
					What does the car need to do that requires power?
				</p>
				<MyMenu />
			</div>
			<section id="middlepart">
				<div class="register">
					<div class="container-fluid">
						<div
							class="row activity"
							style={{ textAlign: 'center' }}
						>
							<div class="col-lg-6" style={{ marginTop: '50px' }}>
								<svg
									height="580px"
									id="Layer_1"
									version="1.1"
									viewbox="-30 -30 550 550"
									width="580px"
									xmlns="http://www.w3.org/2520/svg"
									style={{ overflow: 'inherit' }}
								>
									<polygon
										class="current_subtask_map"
										id="problem1funcmodel_create"
										onclick="openfuncmodel()"
										points="0,250 0,500 125,375"
									></polygon>
									<text
										x="10"
										y="375"
										class="current_subtask_text"
									>
										Identify all
										<tspan x="10" y="395">
											actions
										</tspan>
									</text>
									<polygon
										class="subtask_map"
										id="problem1funcmodel_eval"
										onclick="openfunceval()"
										points="0,500 125,375 130,500"
									></polygon>
									<text x="65" y="450" class="subtask_text">
										Identify
										<tspan x="50" y="470">
											dominant
										</tspan>
										<tspan x="45" y="490">
											actions
										</tspan>
									</text>
									<g onclick="openfuncplan()">
										<polygon
											class="subtask_map"
											id="problem1funcmodel_plan"
											onclick="openfuncplan()"
											points="125,375 125,500 250,500"
										></polygon>
										<text
											class="subtask_text"
											x="150"
											y="450"
										>
											Plan
											<tspan x="150" y="470">
												Next
											</tspan>
											<tspan x="150" y="490">
												Steps
											</tspan>
										</text>
									</g>
									<g onclick="openqual()">
										<polygon
											class="task_map"
											id="problem1funcmodel_task2"
											points="0,0 0,250 250,500 500,500"
										></polygon>
										<text class="task_text" x="80" y="300">
											Qualitative Modeling
										</text>
									</g>
									<g onclick="openquant()">
										<polygon
											class="task_map"
											id="problem1funcmodel_task3"
											points="250,0 250,250 500,500 500,250"
										></polygon>
										<text class="task_text" x="280" y="250">
											Quantitative Modeling
										</text>
									</g>
									<g onclick="opencalc()">
										<polygon
											class="task_map"
											id="problem1funcmodel_task4"
											points="0,0 250,250 250,0"
										></polygon>
										<text class="task_text" x="120" y="80">
											Calculation
										</text>
									</g>
									<g onclick="openeval()">
										<polygon
											class="task_map"
											id="problem1funcmodel_task5"
											points="250,0 500,250 500,0"
										></polygon>
										<text class="task_text" x="370" y="80">
											Evaluation
										</text>
									</g>
									<g>
										<text
											class="current_task_text"
											transform="rotate(-90 -10,500)"
											x="10"
											y="500"
										>
											Functional Modeling
										</text>
										<path
											class="current_task_path"
											d="M 0,250 L 0,500 L 250,500 Z"
											id="problem1funcmodel_task1"
										></path>
									</g>
								</svg>
							</div>
							<div class="col-lg-6" style={{ marginTop: '30px' }}>
								<div
									style={{
										height: 'auto',
										width: '600px',
										borderStyle: 'groove',
										padding: '10px',
									}}
								>
									<div class="row">
										<div class="col-lg-12">
											<span class="current_subtask_text">
												According to the problem
												specifications, what does the
												car need to do that requires
												power?
											</span>
											<br />

											<span class="subtask_text">
												Draw a free body diagram of the
												car or look at the simulator.
												Now answer the following
												questions:
											</span>
											<div
												id="problem1funcmodelprompts_prompts"
												class="medium_margin subtask_text txt_left"
											>
												1) What are the forces moving
												the car forward? <br />
												<div style={{ margin: '20px' }}>
													<textarea
														id="answer1"
														class="form-control input-large"
														rows="1"
														value={
															answerData.answer1 ||
															''
														}
														onChange={handleChange}
														disabled={
															role === 'Navigator'
														}
													></textarea>
												</div>
												2) What are the forces that are
												opposing the car as it moves
												forward? <br />
												<div style={{ margin: '20px' }}>
													<textarea
														id="answer2"
														class="form-control input-large"
														rows="1"
														value={
															answerData.answer2 ||
															''
														}
														onChange={handleChange}
														disabled={
															role === 'Navigator'
														}
													/>
												</div>
												3) When a constant power is
												supplied, how is it used by the
												car? <br />
												<div style={{ margin: '20px' }}>
													<textarea
														id="answer3"
														class="form-control input-large"
														rows="1"
														value={
															answerData.answer3 ||
															''
														}
														onChange={handleChange}
														disabled={
															role === 'Navigator'
														}
													></textarea>
												</div>
												4) In order to maintain a
												constant acceleration, is the
												power required constant or
												increasing? What causes power to
												increase?
												<div style={{ margin: '20px' }}>
													<textarea
														id="answer4"
														class="form-control input-large"
														rows="1"
														value={
															answerData.answer4 ||
															''
														}
														onChange={handleChange}
														disabled={
															role === 'Navigator'
														}
													></textarea>
												</div>
											</div>
										</div>
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

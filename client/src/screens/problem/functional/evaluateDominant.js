import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import SubQuestionDiagramComponent from '../../../components/problem/subqDiagramComponent';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../../services/socket';
import { authContext } from '../../../services/authContext.js';
import { useContext } from 'react';
import QuestionForm from '../../../components/global/questionForm';

export default function FunctionalEvaluateDominantScreen() {
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
					)}&tag=functional&subtype=evaluatedominant`,
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
					`${apiurl}/answer/type?sessionId=${sessionId}&type=functional&subtype=evaluatedominant`,
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

	const handleBack = () => {
		const path = loc.pathname.replace('dominant', 'check');

		sessionSocket.emit('forward', {
			eventDesc: 'funcevaluatedom--navigate',
			sessionId: sessionId,
			path: path,
		});

		navigate(path);
	};

	const handlePlan = () => {
		const path = loc.pathname
			.replace('evaluate', 'plan')
			.replace('/dominant', '');

		sessionSocket.emit('forward', {
			eventDesc: 'funcevaluatedom--navigate',
			sessionId: sessionId,
			path: path,
		});

		navigate(path);
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'funcevaluatedom--navigate') {
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
									minipart="evaluate"
									sessionId={sessionId}
								/>
							</div>
							<div class="col-lg-6" style={{ marginTop: '30px' }}>
								<QuestionForm
									type="functional"
									subtype="evaluatedominant"
									questionData={questionData}
									answerData={answerData}
									setAnswerData={setAnswerData}
								/>
								<div
									class="medium_margin subtask_text"
									style={{ width: '550px' }}
								>
									<button
										style={{
											float: 'left',
											margin: '10px',
										}}
										disabled={role === 'Navigator'}
										class="btn btn-info"
										onClick={handleBack}
									>
										Go back to check your list of actions
									</button>
									<button
										style={{
											float: 'right',
											color: '#333',
											textDecoration: 'none',
											borderRadius: '4px',
											backgroundColor: '#ccc',
											margin: '10px',
										}}
										disabled={role === 'Navigator'}
										class="btn"
										onClick={handlePlan}
									>
										Plan what you will do next
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

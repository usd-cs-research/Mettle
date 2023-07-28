import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import SubQuestionDiagramComponent from '../../../components/problem/subqDiagramComponent';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../../services/socket';
import { authContext } from '../../../services/authContext.js';
import { useContext } from 'react';
import QuestionForm from '../../../components/global/questionForm';

export default function QuantitativeModelScreen() {
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

				const res2 = await fetch(
					`${apiurl}/answer/type?sessionId=${sessionId}&type=quantitative&subtype=model`,
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
							<div class="col-lg-6" style={{ marginTop: '50px' }}>
								<QuestionForm
									type="quantitative"
									subtype="model"
									questionData={questionData}
									answerData={answerData}
									setAnswerData={setAnswerData}
								/>
								<div
									class="medium_margin subtask_text"
									style={{ width: '550px' }}
								>
									<button
										class="btn  btn-info"
										disabled={role === 'Navigator'}
										style={{ float: 'right' }}
										onClick={qualitativeEval}
									>
										Check to see if the equation is complete
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

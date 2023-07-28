import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import { sessionSocket } from '../../../services/socket';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SubQuestionDiagramComponent from '../../../components/problem/subqDiagramComponent';
import { authContext } from '../../../services/authContext.js';
import { useContext } from 'react';
import QuestionForm from '../../../components/global/questionForm';

export default function FunctionalModelMainScreen() {
	const role = localStorage.getItem('role');
	const { sessionId } = useParams();
	const loc = useLocation();
	const navigate = useNavigate();
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});
	const [answerData, setAnswerData] = useState({});
	const { showPopup } = useContext(authContext);

	useEffect(() => {
		const getData = async () => {
			try {
				const res = await fetch(
					`${apiurl}/question/sub?questionId=${localStorage.getItem(
						'questionId',
					)}&tag=functional&subtype=modelmain`,
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
					`${apiurl}/answer/type?sessionId=${sessionId}&type=functional&subtype=modelmain`,
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

	const handleCheck = () => {
		const path = loc.pathname
			.replace('model', 'evaluate')
			.replace('main', 'check');

		sessionSocket.emit('forward', {
			eventDesc: 'modelmain--navigate--modelprompts',
			sessionId: sessionId,
			path: path,
		});

		navigate(path);
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'modelmain--navigate--modelprompts') {
			navigate(data.path);
		}

		if (data.eventDesc === 'modelmain--navigate--evaluatedominant') {
			navigate(data.path);
		}

		if (data.eventDesc === 'modelmain--navigate--plan') {
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
								<QuestionForm
									type="functional"
									subtype="modelmain"
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
											float: 'right',
											margin: '10px',
										}}
										onClick={handleCheck}
										id="problem1funcmodel_check"
										disabled={role === 'Navigator'}
									>
										Check if your list is complete
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

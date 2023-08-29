import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import SubQuestionDiagramComponent from '../../../components/problem/subqDiagramComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../../services/socket';
import { authContext } from '../../../services/authContext.js';
import { useContext } from 'react';

export default function EvaluationMapScreen() {
	const { sessionId } = useParams();
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});
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

				const data = await res.json();
				setQuestionData(data);
			} catch (error) {
				showPopup(error.message || 'Error', 'red');
			}
		};

		getData();
	}, []);

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'evaluationmap--navigate') {
			navigate(data.path);
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
						'You have not satisfied the evaluation criteria for a reasonable estimate. Think about which part of the estimation process the error could be in. Click on that sub-goal to redo and modify your solution.'
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
							<div
								class="col-lg-12"
								style={{ marginTop: '50px' }}
							>
								<SubQuestionDiagramComponent
									sessionId={sessionId}
								/>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

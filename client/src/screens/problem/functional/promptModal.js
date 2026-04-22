import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../../services/socket';
import { authContext } from '../../../services/authContext.js';
import { useContext } from 'react';
import QuestionForm from '../../../components/global/questionForm';

export default function PromptModal() {
	const { sessionId } = useParams();
	const role = localStorage.getItem('role');
	const loc = useLocation();
	const apiurl = process.env.REACT_APP_API_URL;
	const navigate = useNavigate();
	const { showPopup } = useContext(authContext);

	const [propmptAnswerData, setPromptAnswerData] = useState({});
	const [promptQuestionData, setPromptQuestionData] = useState({});

	useEffect(() => {
		const getData = async () => {
			try {
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

				const res2 = await fetch(
					`${apiurl}/answer/type?sessionId=${sessionId}&type=functional&subtype=modelprompts`,
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
				setPromptQuestionData(data);
				if (data2.answers.length > 0) {
					setPromptAnswerData(data2?.answers[0]);
				}
			} catch (error) {
				showPopup(error.message || 'Error', 'red');
			}
		};

		getData();
	}, []);

	const handlePrevious = () => {
		const path = loc.pathname
			.replace('evaluate', 'model')
			.replace('check', 'main');
		console.log(path);

		sessionSocket.emit('forward', {
			eventDesc: 'modelprompts--navigate--modelmain',
			sessionId: sessionId,
			path: path,
		});

		navigate(path);
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'modelprompts--navigate--modelmain') {
			navigate(data.path);
		}
	});

	return (
		<>
			<div className="main--overlay"></div>
			<div className="sub--overlay">
				<QuestionForm
					type="functional"
					subtype="modelprompts"
					questionData={promptQuestionData}
					answerData={propmptAnswerData}
					setAnswerData={setPromptAnswerData}
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
						class="btn btn-info"
						id="problem1funcmodelprompts_back"
						disabled={role === 'Navigator'}
						onClick={handlePrevious}
					>
						Go back and edit your list of actions
					</button>
				</div>
			</div>
		</>
	);
}

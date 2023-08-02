import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../components/problem/problemHeader';
import './aboutproblem.css';
import problem_overview from '../../assets/videos/problem_overview.mp4';
import DynamicDiagramComponent from '../../components/problem/diagramComponent';
import MyMenu from '../../components/problem/myMenu';
import { useParams } from 'react-router-dom';
import { sessionSocket } from '../../services/socket'; // Make sure to import sessionSocket here
import CustomVideoPlayer from '../../components/problem/videoPlayer';

export default function AboutProblemScreen() {
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});
	const { sessionId } = useParams(); // Use useParams to get the sessionId
	const [subquestionData, setSubquestionData] = useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Function to open the modal
	const openModal = () => {
		setIsModalOpen(true);
		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: 'problemMap-modal-open',
		});
	};

	// Function to close the modal
	const closeModal = () => {
		setIsModalOpen(false);
		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: 'problemMap-modal-close',
		});
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'problemMap-modal-open') {
			setIsModalOpen(true);
		}
		if (data.eventDesc === 'problemMap-modal-close') {
			setIsModalOpen(false);
		}
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(
					`${apiurl}/session/status?sessionId=${sessionId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				);
				const data = await res.json();
				localStorage.setItem('questionId', data.session.questionId);
				const response = await fetch(
					`${apiurl}/question/main?questionId=${data.session.questionId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				);
				const data2 = await response.json();
				setQuestionData(data2);
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
	}, [sessionId]);

	useEffect(() => {
		if (questionData.question) {
			const mappedData = {};
			questionData.question.subQuestions.forEach((subQuestion) => {
				mappedData[subQuestion.tag] = subQuestion.question;
			});
			setSubquestionData(mappedData);
		}
	}, [questionData]);

	return (
		<>
			<ProblemHeader />
			<div className="info">
				<p>
					Find guidelines for solving the current and similar
					estimation problems here
				</p>
				<MyMenu
					question={
						questionData.question?.question || 'Loading Question'
					}
				/>
			</div>
			<div className="container-fluid">
				<div className="row">
					<div className="col-lg-6">
						<h4 className="ab-subtitle">
							The sub-goals of this problem
						</h4>
						{questionData.question && (
							<DynamicDiagramComponent
								functional={
									subquestionData.functional ||
									'Loading Question'
								}
								qualitative={
									subquestionData.qualitative ||
									'Loading Question'
								}
								quantitative={
									subquestionData.quantitative ||
									'Loading Question'
								}
								calculation={
									subquestionData.calculation ||
									'Loading Question'
								}
								evaluation={
									subquestionData.evaluation ||
									'Loading Question'
								}
								sessionId={sessionId}
							/>
						)}
					</div>
					<div
						className="col-lg-6"
						style={{ textAlign: 'center', verticalAlign: 'middle' }}
					>
						<div
							className="row activity"
							style={{ textAlign: 'center' }}
						>
							<button
								onClick={openModal}
								id="sel_aboutEst"
								type="button"
								className="btn btn-primary"
							>
								About Estimation
							</button>
						</div>
						<div className="row" style={{ marginLeft: 0 }}>
							<h4
								style={{
									fontWeight: 'bold',
									paddingTop: '5px',
									paddingBottom: '15px',
								}}
							>
								Learn about solving estimation problems
							</h4>
							<CustomVideoPlayer videoSrc={problem_overview} />
						</div>
					</div>
				</div>
			</div>
			{/* The modal for estimation info */}
			{isModalOpen && (
				<div
					className="modal"
					style={{ display: isModalOpen ? 'block' : 'none' }}
				>
					<div className="modal-content">
						<span className="close" onClick={closeModal}>
							&times;
						</span>
						<span className="subtask_text">
							<ul>
								<li>
									Estimation is the process of determining
									approximate values (say, to the right order
									of magnitude) for a physical quantity in a
									physical system without complete information
									and knowledge of the context.
								</li>{' '}
								<br />
								<li>
									Estimation is often done as a first step in
									design, to establish the feasibility of an
									idea or to evaluate if a component can be
									used in the design.
								</li>{' '}
								<br />
								<li>
									The emphasis in estimation is on “speed” and
									“reasonableness”. In other words, we would
									rather have an approximate number quickly
									rather than do elaborate time-consuming
									calculations to get the exact number because
									approximate numbers are sufficient to make
									decisions and move forward in the design
									process. A good way to get a useful estimate
									is to consider the “worst case” scenario and
									find the maximum value for a parameter. So
									think about what is the worst case scenario
									and when is the parameter value likely to be
									the highest.
								</li>{' '}
								<br />
								<li>
									Practicing engineers often make such
									estimates on the job for many quantities
									such as power required, time required, speed
									attainable, weight of an object, etc. When
									you graduate and begin working you will be
									required to make such estimates on the job.
								</li>{' '}
								<br />
								<li>
									In addition to being able to estimate
									quantities, you must be able to evaluate if
									the value for a physical quantity “makes
									sense” or is reasonable in the given
									context.
								</li>{' '}
								<br />
							</ul>
						</span>
					</div>
				</div>
			)}
		</>
	);
}

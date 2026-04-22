import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../components/problem/problemHeader';
import './aboutproblem.css';
import problem_overview from '../../assets/videos/problem_overview.mp4';
import MyMenu from '../../components/problem/myMenu';
import { useParams } from 'react-router-dom';
import { sessionSocket } from '../../services/socket';
import CustomVideoPlayer from '../../components/problem/videoPlayer';

export default function AboutProblemScreen() {
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});
	const { sessionId } = useParams();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => {
		setIsModalOpen(true);
		sessionSocket.emit('forward', {
			sessionId,
			eventDesc: 'problemMap-modal-open',
		});
	};

	const closeModal = () => {
		setIsModalOpen(false);
		sessionSocket.emit('forward', {
			sessionId,
			eventDesc: 'problemMap-modal-close',
		});
	};

	useEffect(() => {
		const handleForward = (data) => {
			if (data.eventDesc === 'problemMap-modal-open') {
				setIsModalOpen(true);
			}

			if (data.eventDesc === 'problemMap-modal-close') {
				setIsModalOpen(false);
			}
		};

		sessionSocket.on('forward', handleForward);

		return () => {
			sessionSocket.off('forward', handleForward);
		};
	}, []);

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
	}, [apiurl, sessionId]);

	return (
		<ProblemHeader>
			<section className="estimation-guide">
				<div className="estimation-guide__hero">
					<div className="estimation-guide__copy">
						<p className="estimation-guide__eyebrow">Estimation Guide</p>
						<h1 className="estimation-guide__title">
							Build quick, reasonable estimates with confidence
						</h1>
						<p className="estimation-guide__description">
							Review the mindset behind engineering estimation,
							open a clean summary of the basics, and watch the
							walkthrough before returning to the problem.
						</p>
						<div className="estimation-guide__actions">
							<button
								onClick={openModal}
								id="sel_aboutEst"
								type="button"
								className="estimation-guide__button"
							>
								Open Estimation Basics
							</button>
							<span className="estimation-guide__tag">
								Useful for current and similar problems
							</span>
						</div>
					</div>
					<div className="estimation-guide__question-card">
						<p className="estimation-guide__question-label">
							Current Problem
						</p>
						<MyMenu
							question={
								questionData.question?.question || 'Loading Question'
							}
						/>
					</div>
				</div>

				<section className="estimation-guide__video-panel">
					<div className="estimation-guide__section-heading">
						<p className="estimation-guide__section-label">Walkthrough</p>
						<h2 className="estimation-guide__section-title">
							Learn how to approach estimation problems
						</h2>
						<p className="estimation-guide__section-description">
							Use the video as a quick reset when you want to
							recheck the process, assumptions, and reasoning flow.
						</p>
					</div>
					<CustomVideoPlayer videoSrc={problem_overview} />
				</section>
			</section>

			{isModalOpen && (
				<div
					className="estimation-guide-modal"
					style={{ display: isModalOpen ? 'flex' : 'none' }}
				>
					<div className="estimation-guide-modal__content">
						<button
							type="button"
							className="estimation-guide-modal__close"
							onClick={closeModal}
							aria-label="Close estimation basics"
						>
							&times;
						</button>
						<div className="estimation-guide-modal__header">
							<p className="estimation-guide-modal__eyebrow">
								Estimation Basics
							</p>
							<h3 className="estimation-guide-modal__title">
								A practical framework for making fast engineering estimates
							</h3>
							<p className="estimation-guide-modal__subtitle">
								Look for useful approximations, make defensible
								assumptions, and sanity-check the result before
								you move on.
							</p>
						</div>
						<div className="estimation-guide-modal__body">
							<ul className="estimation-guide-modal__list">
								<li>
									Estimation is the process of determining approximate
									values, often to the right order of magnitude, for a
									physical quantity in a system without complete
									information.
								</li>
								<li>
									It is often used early in design work to test
									feasibility and decide whether a concept or component
									is worth pursuing further.
								</li>
								<li>
									The goal is speed and reasonableness. A useful estimate
									delivered quickly is often more valuable than an exact
									answer that takes too long to compute. Worst-case
									thinking can help you choose defensible upper bounds.
								</li>
								<li>
									Practicing engineers estimate many quantities on the
									job, including power, time, speed, and weight, so this
									is a core professional skill.
								</li>
								<li>
									You should also evaluate whether your final value makes
									sense in the given context rather than accepting a
									number just because it came from a calculation.
								</li>
							</ul>
						</div>
					</div>
				</div>
			)}
		</ProblemHeader>
	);
}

import React, { useState } from 'react';
import './diagramcomponent.css';
import { sessionSocket } from '../../services/socket';

const DynamicDiagramComponent = (props) => {
	const role = localStorage.getItem('role');
	const [visibleSubQuestions, setVisibleSubQuestions] = useState({
		functional: false,
		qualitative: false,
		quantitative: false,
		evaluation: false,
		calculation: false,
	});

	const clickHandler = (event) => {
		const isDisabled = event.currentTarget.classList.contains('disabled');

		if (isDisabled) {
			return;
		}

		const id = event.currentTarget.id;
		console.log(id);

		setVisibleSubQuestions({
			functional: false,
			qualitative: false,
			quantitative: false,
			evaluation: false,
			calculation: false,
			[id]: !visibleSubQuestions[id],
		});

		console.log(visibleSubQuestions);
	};

	return (
		<>
			<div className="svg--container diagram-component">
				<svg
					version="1.1"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					width="560px"
					height="560px"
					viewBox="-20 -20 540 540"
					xmlSpace="preserve"
				>
					<rect width="500" height="500" fill="#bdbdbd" />

					<g
						id="functional"
						onClick={clickHandler}
						disabled={role === 'Navigator'}
					>
						<polygon
							points="0,250 0,500 250,500"
							className="task_map"
						>
							<title>{props.functional}</title>
						</polygon>
						<text x="5" y="430" className="task_text">
							Functional Modeling
						</text>
					</g>

					<g id="qualitative" onClick={clickHandler}>
						<polygon
							points="0,0 0,250 250,500 500,500"
							className="task_map"
						>
							<title>{props.qualitative}</title>
						</polygon>
						<text x="100" y="300" className="task_text">
							Qualitative Modeling
						</text>
					</g>
					<g id="quantitative" onClick={clickHandler}>
						<polygon
							points="250,0 250,250 500,500 500,250"
							className="task_map"
						>
							<title>{props.quantitative}</title>
						</polygon>
						<text x="290" y="250" className="task_text">
							Quantitative Modeling
						</text>
					</g>

					<g id="calculation" onClick={clickHandler}>
						<polygon
							points="0,0 250,250 250,0"
							className="task_map"
						>
							<title>{props.calculation}</title>
						</polygon>
						<text x="120" y="90" className="task_text">
							Calculation
						</text>
					</g>

					<g id="evaluation" onClick={clickHandler}>
						<polygon
							points="250,0 500,250 500,0"
							className="task_map"
						>
							<title x="360" y="50" className="task_text_eg">
								{props.evaluation}
							</title>
						</polygon>
						<text x="380" y="90" className="task_text">
							Evaluation
						</text>
					</g>
				</svg>
			</div>
			<>
				<div
					id="subQuestion"
					className={`subquestion ${
						visibleSubQuestions.functional ? 'show' : ''
					}`}
				>
					{props.functional}
				</div>
				<div
					id="subQuestion"
					className={`subquestion ${
						visibleSubQuestions.qualitative ? 'show' : ''
					}`}
				>
					{props.qualitative}
				</div>
				<div
					id="subQuestion"
					className={`subquestion ${
						visibleSubQuestions.quantitative ? 'show' : ''
					}`}
				>
					{props.quantitative}
				</div>
				<div
					id="subQuestion"
					className={`subquestion ${
						visibleSubQuestions.calculation ? 'show' : ''
					}`}
				>
					{props.calculation}
				</div>
				<div
					id="subQuestion"
					className={`subquestion ${
						visibleSubQuestions.evaluation ? 'show' : ''
					}`}
				>
					{props.evaluation}
				</div>
			</>
		</>
	);
};

export default DynamicDiagramComponent;

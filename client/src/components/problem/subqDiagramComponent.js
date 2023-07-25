import React from 'react';
import { sessionSocket } from '../../services/socket';
import { useNavigate } from 'react-router-dom';

const SubQuestionDiagramComponent = (props) => {
	const subpart = props.subpart;
	const minipart = props.minipart;
	const sessionId = props.sessionId;
	const navigate = useNavigate();
	const role = localStorage.getItem('role');

	const clickHandler = (event) => {
		const id = event.target.id;
		if (id) {
			const path = `/${sessionId}/problem/${id}`;
			console.log(path);

			sessionSocket.emit('forward', {
				eventDesc: `diagramcomponent--navigate`,
				sessionId: sessionId,
				path: path,
			});

			navigate(path);
		}
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'diagramcomponent--navigate') {
			navigate(data.path);
		}
	});

	const unclickableStyle = {
		pointerEvents: 'none',
	};

	return (
		<>
			<svg
				height="580px"
				id="Layer_1"
				version="1.1"
				viewbox="-30 -30 550 550"
				width="580px"
				xmlns="http://www.w3.org/2520/svg"
				style={{ overflow: 'inherit' }}
			>
				{/* FUNCTIONAL MODELING STARTS HERE */}
				<g style={role === 'Navigator' ? unclickableStyle : {}}>
					<polygon
						onClick={clickHandler}
						id="functional/model/main"
						className={
							subpart === 'functional'
								? 'current_subtask_map'
								: 'subtask_map'
						}
						points="0,250 0,500 250,500"
					/>
					<text x="5" y="450" className="task_text">
						Functional Modeling
					</text>
				</g>
				{subpart === 'functional' && (
					<>
						<g style={role === 'Navigator' ? unclickableStyle : {}}>
							<polygon
								id="functional/model/main"
								onClick={clickHandler}
								className={
									minipart === 'model'
										? 'current_subtask_map'
										: 'subtask_map'
								}
								points="0,500 125,375 0,250"
							/>
							<text
								x="10"
								y="375"
								className={
									minipart === 'model'
										? 'current_subtask_text'
										: 'subtask_text'
								}
							>
								Identify all
								<tspan x="10" y="395">
									actions
								</tspan>
							</text>
						</g>
						<g style={role === 'Navigator' ? unclickableStyle : {}}>
							<polygon
								id="functional/evaluate/check"
								onClick={clickHandler}
								className={
									minipart === 'evaluate'
										? 'current_subtask_map'
										: 'subtask_map'
								}
								points="0,500 125,375 130,500"
							/>
							<text
								x="65"
								y="450"
								class={
									minipart === 'evaluate'
										? 'current_subtask_text'
										: 'subtask_text'
								}
							>
								Identify
								<tspan x="50" y="470">
									dominant
								</tspan>
								<tspan x="45" y="490">
									actions
								</tspan>
							</text>
						</g>
						<g style={role === 'Navigator' ? unclickableStyle : {}}>
							<polygon
								id="functional/plan"
								onClick={clickHandler}
								className={
									minipart === 'plan'
										? 'current_subtask_map'
										: 'subtask_map'
								}
								points="125,375 125,500 250,500"
							></polygon>
							<text
								className={
									minipart === 'plan'
										? 'current_subtask_text'
										: 'subtask_text'
								}
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
					</>
				)}

				{/* QUALITATIVE MODELING STARTS HERE */}
				<g
					id="qualitative/model"
					style={role === 'Navigator' ? unclickableStyle : {}}
					onClick={clickHandler}
				>
					<polygon
						className={
							subpart === 'qualitative'
								? 'current_subtask_map'
								: 'subtask_map'
						}
						id="qualitative/model"
						points="0,0 0,250 250,500 500,500"
					></polygon>
					<text className="task_text" x="80" y="300">
						Qualitative Modeling
					</text>
				</g>
				{subpart === 'qualitative' && (
					<>
						<g
							style={role === 'Navigator' ? unclickableStyle : {}}
							id="qualitative/model"
							onClick={clickHandler}
						>
							<polygon
								id="qualitative/model"
								points="0,0 0,250 250,500 250,250"
								className={
									minipart === 'model'
										? 'current_subtask_map'
										: 'subtask_map'
								}
							/>
							<text
								x="60"
								y="250"
								className={
									minipart === 'model'
										? 'current_subtask_text'
										: 'subtask_text'
								}
							>
								Create a causal map
							</text>
						</g>
						<g
							id="qualitative/evaluate/check"
							onClick={clickHandler}
							style={role === 'Navigator' ? unclickableStyle : {}}
						>
							<polygon
								id="qualitative/evaluate/check"
								points="250,250 250,500 375,375"
								className={
									minipart === 'evaluate'
										? 'current_subtask_map'
										: 'subtask_map'
								}
							/>
							<text
								x="260"
								y="365"
								className={
									minipart === 'evaluate'
										? 'current_subtask_text'
										: 'subtask_text'
								}
							>
								Identify
								<tspan x="260" y="385">
									dominant
								</tspan>
								<tspan x="260" y="405">
									parameters
								</tspan>
							</text>
						</g>
						<g
							id="qualitative/plan"
							onClick={clickHandler}
							style={role === 'Navigator' ? unclickableStyle : {}}
						>
							<polygon
								id="qualitative/plan"
								points="250,500 375,375 500,500"
								className={
									minipart === 'plan'
										? 'current_subtask_map'
										: 'subtask_map'
								}
							/>
							<text
								x="320"
								y="470"
								className={
									minipart === 'plan'
										? 'current_subtask_text'
										: 'subtask_text'
								}
							>
								Plan Next steps
							</text>
						</g>
					</>
				)}

				{/* QUANTITATIVE MODELING STARTS HERE */}
				<g
					style={role === 'Navigator' ? unclickableStyle : {}}
					onClick={clickHandler}
					id="quantitative/model"
				>
					<polygon
						className={
							subpart === 'quantitative'
								? 'current_subtask_map'
								: 'subtask_map'
						}
						id="quantitative/model"
						points="250,0 250,250 500,500 500,250"
					></polygon>
					<text className="task_text" x="280" y="250">
						Quantitative Modeling
					</text>
				</g>

				{subpart === 'quantitative' && (
					<>
						<g
							onClick={clickHandler}
							style={role === 'Navigator' ? unclickableStyle : {}}
							id="quantitative/model"
						>
							<polygon
								id="quantitative/model"
								className={
									minipart === 'model'
										? 'current_subtask_map'
										: 'subtask_map'
								}
								points="250,0 250,250 500,250"
							/>
							<text
								x="260"
								y="200"
								className={
									minipart === 'model'
										? 'current_subtask_text'
										: 'subtask_text'
								}
							>
								{' '}
								Create the equation{' '}
							</text>
						</g>
						<g
							onClick={clickHandler}
							style={role === 'Navigator' ? unclickableStyle : {}}
							id="quantitative/evaluate/check"
						>
							<polygon
								id="quantitative/evaluate/check"
								className={
									minipart === 'evaluate'
										? 'current_subtask_map'
										: 'subtask_map'
								}
								points="250,250 375,375 500,250"
							/>
							<text
								x="310"
								y="280"
								className={
									minipart === 'evaluate'
										? 'current_subtask_text'
										: 'subtask_text'
								}
							>
								Examine its
							</text>
							<text
								x="310"
								y="300"
								className={
									minipart === 'evaluate'
										? 'current_subtask_text'
										: 'subtask_text'
								}
							>
								completeness
							</text>
						</g>
						<g
							onClick={clickHandler}
							style={role === 'Navigator' ? unclickableStyle : {}}
							id="quantitative/plan"
						>
							<polygon
								id="quantitative/plan"
								className={
									minipart === 'plan'
										? 'current_subtask_map'
										: 'subtask_map'
								}
								points="375,375 500,500 500,250"
							/>
							<text
								x="420"
								y="380"
								className={
									minipart === 'plan'
										? 'current_subtask_text'
										: 'subtask_text'
								}
							>
								Plan Next
								<tspan x="420" y="400">
									Steps
								</tspan>
							</text>
						</g>
					</>
				)}

				{/* CALCULATION MODELING STARTS HERE */}
				<g
					onClick={clickHandler}
					style={role === 'Navigator' ? unclickableStyle : {}}
					id="calculation/calculation"
				>
					<polygon
						className={
							subpart === 'calculation'
								? 'current_subtask_map'
								: 'subtask_map'
						}
						id="calculation/calculation"
						points="0,0 250,250 250,0"
					></polygon>
					<text className="task_text" x="120" y="80">
						Calculation
					</text>
				</g>

				{subpart === 'calculation' && (
					<g
						style={role === 'Navigator' ? unclickableStyle : {}}
						onClick={clickHandler}
						id="calculation/calculation"
					>
						<polygon
							id="calculation/calculation"
							points="0,0 250,250 250,0"
							class="current_subtask_map"
						/>
						<text x="90" y="40" class="current_subtask_text">
							Search Values{' '}
							<tspan x="90" y="60" class="subtask_text">
								{' '}
								for variables{' '}
							</tspan>
						</text>
						<polygon
							id="calculation/calculation"
							points="130,130 250,130 250,0"
							class="current_subtask_map"
						/>
						<text x="180" y="95" class="current_subtask_text">
							Evaluate{' '}
							<tspan x="180" y="115" class="subtask_text">
								{' '}
								Values{' '}
							</tspan>{' '}
						</text>
						<polygon
							id="calculation/calculation"
							points="130,130 250,250 250,130"
							class="current_subtask_map"
						/>
						<text x="175" y="150" class="current_subtask_text">
							Calculate{' '}
							<tspan x="175" y="170" class="subtask_text">
								{' '}
								Estimate{' '}
							</tspan>{' '}
						</text>
					</g>
				)}

				{/* EVALUVATION MODELING STARTS HERE */}
				<g
					onClick={clickHandler}
					style={role === 'Navigator' ? unclickableStyle : {}}
					id="evaluation/evaluation"
				>
					<polygon
						className={
							subpart === 'evaluation'
								? 'current_subtask_map'
								: 'subtask_map'
						}
						id="evaluation/evaluation"
						points="250,0 500,250 500,0"
					></polygon>
					<text className="task_text" x="370" y="80">
						Evaluation
					</text>
				</g>

				{subpart === 'evaluation' && (
					<g
						onClick={clickHandler}
						style={role === 'Navigator' ? unclickableStyle : {}}
						id="evaluation/evaluation"
					>
						<polygon
							points="250,0 500,0 375,125"
							id="evaluation/evaluation"
							class="current_subtask_map"
						/>
						<text x="340" y="40" class="current_subtask_text">
							Order of{' '}
							<tspan x="340" y="60">
								{' '}
								magnitude{' '}
							</tspan>{' '}
						</text>
						<polygon
							points="500,0 375,125 500,250"
							id="evaluation/evaluation"
							class="current_subtask_map"
						/>
						<text x="400" y="130" class="current_subtask_text">
							Comparable{' '}
							<tspan x="400" y="150">
								{' '}
								Values{' '}
							</tspan>
						</text>
					</g>
				)}

				{subpart === 'functional' && (
					<g>
						<text
							className="current_task_text"
							transform="rotate(-90 -10,500)"
							x="10"
							y="500"
						>
							Functional Modeling
						</text>
						<path
							className="current_task_path"
							d="M 0,250 L 0,500 L 250,500 Z"
							id="problem1funcmodel_task1"
						></path>
					</g>
				)}
				{subpart === 'qualitative' && (
					<g>
						<text
							x="-10"
							y="220"
							transform="rotate(-90 -10,220)"
							className="current_task_text"
						>
							Qualitative Modeling
						</text>
						<path
							id="problem1qualmodel_task2"
							d="M 0,0 L 0,250 L 250,500 L 500,500 Z"
							className="current_task_path"
						/>
					</g>
				)}
				{subpart === 'quantitative' && (
					<g>
						<text
							x="350"
							y="450"
							className="current_task_text"
							transform="rotate(90 520,450)"
						>
							Quantitative Modeling
						</text>

						<path
							id="problem1quantmodel_task3"
							d="M 250 0 L 250 250 L 500 500 L 500 250 Z"
							className="current_task_path"
						/>
					</g>
				)}
				{subpart === 'calculation' && (
					<g>
						<text x="80" y="-10" className="current_task_text">
							Calculation
						</text>
						<path
							id="problem1calc_task4"
							d="M 0,0 L 250,250 L 250,0 Z"
							className="current_task_path"
						/>
					</g>
				)}
				{subpart === 'evaluation' && (
					<g>
						<text
							x="520"
							y="100"
							className="current_task_text"
							transform="rotate(90 520,100)"
						>
							Evaluation
						</text>
						<path
							id="problem1eval_task5"
							d="M 250,0 L 500,250 L 500,0 Z"
							className="current_task_path"
						/>
					</g>
				)}
			</svg>
		</>
	);
};

export default SubQuestionDiagramComponent;

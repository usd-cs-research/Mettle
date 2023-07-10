import React from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';

export default function FunctionalEvaluateDominantScreen() {
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
										class="subtask_map"
										id="problem1funcmodel_create"
										onclick="openfuncmodel()"
										points="0,250 0,500 125,375"
									></polygon>
									<text x="10" y="375" class="subtask_text">
										Identify all
										<tspan x="10" y="395">
											actions
										</tspan>
									</text>
									<polygon
										class="current_subtask_map"
										id="problem1funcmodel_eval"
										onclick="openfunceval()"
										points="0,500 125,375 130,500"
									></polygon>
									<text
										x="65"
										y="450"
										class="current_subtask_text"
									>
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
										width: '650px',
										borderStyle: 'groove',
										padding: '10px',
									}}
								>
									These are the actions that you identified
									<div
										id="pre_txt"
										class="medium_margin rcorners"
									></div>
									<div
										class="medium_margin subtask_text txt_left"
										style={{ padding: '10px' }}
									>
										1) According to the problem
										specifications, which of the actions
										dominates the power requirements?
										Justify if you can ignore the power
										required for the other actions.
										<button
											style={{ float: 'right' }}
											class="btn btn-primary"
											id="problem1funcevaldom_guide"
											type="button"
										>
											Guide Me
										</button>
										<textarea
											id="question0"
											rows="3"
											cols="60"
											name="question0"
										></textarea>{' '}
										<br />
										2) While estimating power for a design,
										would you determine the maximum, average
										or instantaneous power required? Why?{' '}
										<br />
										<textarea
											id="question1"
											rows="3"
											cols="60"
											name="question1"
										></textarea>
										<div class="popup">
											<span
												class="popuptextsmall"
												id="problem1funcevaldom_hint2"
											>
												We want the motor to provide
												enough power to run the car at
												the worst operating conditions.
												So we will consider the maximum
												power required.
											</span>
										</div>
										<button
											style={{ float: 'right' }}
											onClick="openhint2()"
											class="btn btn-warning"
											id="problem1funcevaldom_hint2btn"
											type="button"
										>
											Hint
										</button>
										<br />
										3) At what point in the track will the
										maximum power be needed?
										<textarea
											id="question2"
											rows="2"
											cols="60"
											name="question2"
										></textarea>
										<div class="popup">
											<span
												class="popuptextsmall"
												id="problem1funcevaldom_hint3"
											>
												Since power keeps increasing
												with time, the maximum power
												will be needed at the end of the
												track, when the velocity is
												maximum.
											</span>
										</div>
										<button
											style={{ float: 'right' }}
											onClick="openhint3()"
											class="btn btn-warning"
											id="problem1funcevaldom_hint3btn"
											type="button"
										>
											Hint
										</button>
										<br />
									</div>
								</div>
								<div
									class="medium_margin subtask_text"
									style={{ width: '550px' }}
								>
									<button
										style={{
											float: 'left',
											margin: '10px',
										}}
										onclick="openfunceval();"
										id="problem1funcevaldom_back"
										type="button"
										class="btn btn-info"
									>
										{' '}
										Go back to check your list of actions{' '}
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
										onclick="openfuncplan();"
										class="btn"
										id="problem1funcevaldom_next"
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

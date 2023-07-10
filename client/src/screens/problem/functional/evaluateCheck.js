import React from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';

export default function FunctionalEvaluateCheckScreen() {
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
										width: '550px',
										borderStyle: 'groove',
									}}
								>
									<div class="row">
										<div class="col-lg-12">
											<span class="subtask_text">
												These are the actions that you
												identified
											</span>
											<div
												id="pre_txt"
												class="medium_margin rcorners"
											></div>
											<div
												class="medium_margin"
												style={{ textAlign: 'left' }}
											>
												<span class="task_text_eg">
													The operating conditions of
													the car are the acceleration
													required and maximum
													velocity attained, as
													determined from the problem
													specifications (using the
													equations of motion).
												</span>
												<br />
												<br />
												<span class="subtask_text">
													1. What is the acceleration
													required from the car?
													<br />
													<textarea
														id="question0"
														rows="1"
														cols="20"
														name="question0"
													></textarea>
													<br />
													2. What is the maximum
													velocity attained by the
													car?
													<br />
													<textarea
														id="question1"
														rows="1"
														cols="20"
														name="question1"
													></textarea>
													<br />
													<br />
													3. Which of these actions
													does your list of actions
													include? <br />
													a) Accelerating over the
													entire track <br />
													b) Overcoming drag over the
													entire track
												</span>
											</div>
										</div>
									</div>
								</div>
								<div
									class="medium_margin subtask_text"
									style={{ width: '550px' }}
								>
									<g onclick="clickIncludedOneButton()">
										<button
											style={{
												float: 'right',
												color: '#333',
												textDecoration: 'none',
												borderRadius: '4px',
												backgroundColor: '#ccc',
											}}
											class="btn"
											id="problem1funcevalcheck_fail"
											type="button"
										>
											Included one or neither of these
											actions
										</button>
									</g>
									<button
										style={{
											float: 'left',
										}}
										onclick="openfuncmodel();"
										class="btn btn-info"
										id="problem1funcevalcheck_back"
										type="button"
									>
										Go back to identify actions
									</button>
									<br />
									<br />
									<button
										style={{
											float: 'right',
											color: '#333',
											textDecoration: 'none',
											borderRadius: '4px',
											backgroundColor: '#ccc',
										}}
										onclick="openfuncdom();"
										class="btn"
										id="problem1funcevalcheck_pass"
										type="button"
									>
										Included both these actions
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

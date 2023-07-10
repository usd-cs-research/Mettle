import React from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import { MdClose } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';

export default function FunctionalModelMainScreen() {
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
										class="current_subtask_map"
										id="problem1funcmodel_create"
										onclick="openfuncmodel()"
										points="0,250 0,500 125,375"
									></polygon>
									<text
										x="10"
										y="375"
										class="current_subtask_text"
									>
										Identify all
										<tspan x="10" y="395">
											actions
										</tspan>
									</text>
									<polygon
										class="subtask_map"
										id="problem1funcmodel_eval"
										onclick="openfunceval()"
										points="0,500 125,375 130,500"
									></polygon>
									<text x="65" y="450" class="subtask_text">
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
										padding: '20px',
									}}
								>
									<div class="medium_margin">
										<span class="current_subtask_text">
											According to the problem
											specifications, what does the car
											need to do that requires power?
										</span>
										<br />
										<br />
										<span class="subtask_text">
											You may use the verbs and nouns
											given below to guide you.
											<br />
											You may also want to see the
											Simulator to understand the
											operation of the car.
										</span>
									</div>
									<div class="medium_margin txt_left">
										<table width="100%">
											<tr>
												<td>
													<b>Verbs</b>
												</td>
												<td>
													<b>Verbs</b>
												</td>
												<td>
													<b>Nouns</b>
												</td>
												<td>
													<b>Nouns</b>
												</td>
											</tr>
											<tr>
												<td>runs</td>
												<td>drives</td>
												<td>car</td>
												<td>battery</td>
											</tr>
											<tr>
												<td>supplies</td>
												<td>pushes</td>
												<td>motor</td>
												<td>controller</td>
											</tr>

											<tr>
												<td>powers</td>
												<td>uses</td>
												<td>gears</td>
												<td>torque</td>
											</tr>

											<tr>
												<td>generates</td>
												<td>rotates</td>
												<td>wheel</td>
												<td>speed</td>
											</tr>

											<tr>
												<td>moves</td>
												<td>has</td>
												<td>power</td>
												<td>voltage</td>
											</tr>

											<tr>
												<td>is</td>
												<td>contains</td>
												<td>RPM</td>
												<td>acceleration</td>
											</tr>

											<tr>
												<td>regulates</td>
												<td>overcome</td>
												<td>current</td>
												<td>drag</td>
											</tr>
										</table>
									</div>

									<div style={{ marginTop: '17px' }}>
										<div class="medium_margin">
											List the identified actions here.
										</div>

										<div style={{ margin: '20px' }}>
											<textarea
												id="problem0"
												class="form-control input-large"
												rows="5"
											></textarea>
										</div>

										<button
											type="button"
											class="btn btn-primary btn-sm editable-submit"
										>
											<AiOutlineCheck />
										</button>
										<button
											type="button"
											class="btn btn-default btn-sm editable-cancel"
											style={{
												color: ' #333',
												backgroundColor: '#fff',
												borderColor: '#ccc',
												margin: '5px',
											}}
										>
											<MdClose />
										</button>
									</div>
								</div>
								<div
									class="medium_margin subtask_text"
									style={{ width: '550px' }}
								>
									<button
										style={{
											float: 'right',
											margin: '10px',
										}}
										onclick="openfunceval();"
										id="problem1funcmodel_check"
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

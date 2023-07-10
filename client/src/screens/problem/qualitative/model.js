import React from 'react';
import ProblemHeader from '../../../components/problem/problemHeader';
import MyMenu from '../../../components/problem/myMenu';
import { MdClose } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';

export default function QualitativeModelScreen() {
	const openfunc = () => {
		// Handle the onClick event for openfunc()
	};

	const openqual = () => {
		// Handle the onClick event for openqual()
	};

	const openqualeval = () => {
		// Handle the onClick event for openqualeval()
	};

	const openqualplan = () => {
		// Handle the onClick event for openqualplan()
	};

	const openquant = () => {
		// Handle the onClick event for openquant()
	};

	const opencalc = () => {
		// Handle the onClick event for opencalc()
	};

	const openeval = () => {
		// Handle the onClick event for openeval()
	};

	return (
		<>
			<ProblemHeader />
			<div className="info">
				<p className="col-lg-8 problem-info">
					What are the parameters that affect the dominant mechanical
					power required?
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
									version="1.1"
									id="Layer_1"
									xmlns="http://www.w3.org/2520/svg"
									xmlnsXlink="http://www.w3.org/1999/xlink"
									width="580px"
									height="580px"
									viewBox="-30 -30 550 550"
									xmlSpace="preserve"
								>
									<g onClick={openfunc}>
										<polygon
											id="problem1qualmodel_task1"
											points="0,250 0,500 250,500"
											className="task_map"
										/>
										<text
											x="5"
											y="450"
											className="task_text"
										>
											Functional Modeling
										</text>
									</g>
									<g onClick={openqual}>
										<polygon
											id="problem1qualmodel_create"
											points="0,0 0,250 250,500 250,250"
											className="current_subtask_map"
										/>
										<text
											x="60"
											y="250"
											className="current_subtask_text"
										>
											Create a causal map
										</text>
									</g>
									<g onClick={openqualeval}>
										<polygon
											id="problem1qualmodel_eval"
											points="250,250 250,500 375,375"
											className="subtask_map"
										/>
										<text
											x="260"
											y="365"
											className="subtask_text"
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
									<g onClick={openqualplan}>
										<polygon
											id="problem1qualmodel_plan"
											points="250,500 375,375 500,500"
											className="subtask_map"
										/>
										<text
											x="320"
											y="470"
											className="subtask_text"
										>
											Plan Next steps
										</text>
									</g>
									<g onClick={openquant}>
										<polygon
											id="problem1qualmodel_task3"
											points="250,0 250,250 500,500 500,250"
											className="task_map"
										/>
										<text
											x="280"
											y="250"
											className="task_text"
										>
											Quantitative Modeling
										</text>
									</g>
									<g onClick={opencalc}>
										<polygon
											className="task_map"
											id="problem1funcmodel_task4"
											points="0,0 250,250 250,0"
										/>
										<text
											className="task_text"
											x="120"
											y="80"
										>
											Calculation
										</text>
									</g>
									<g onClick={openeval}>
										<polygon
											className="task_map"
											id="problem1funcmodel_task5"
											points="250,0 500,250 500,0"
										/>
										<text
											className="task_text"
											x="370"
											y="80"
										>
											Evaluation
										</text>
									</g>
									<g onClick={openqual}>
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
								</svg>
							</div>
							<div
								class="col-lg-6"
								style={{
									display: 'flex',
									marginTop: '30px',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<div
									style={{
										height: '550px',
										width: '550px',
										borderStyle: 'groove',
									}}
								>
									<div class="medium_margin">
										<span class="current_subtask_text">
											Draw a causal map showing the
											qualitative relationships between
											total power required and all the
											parameters that affect power.
										</span>
										<br />
										<span class="subtask_text">
											You may use the Simulator available
											at the top of the page.
											<br />
											See the sample diagram below. You
											can change it and create your own.
											Double click on the canvas below to
											add a node.
										</span>
										<g onClick="openhint0()">
											<button
												style={{ float: 'right' }}
												class="btn btn-primary"
												id="problem1qualmodel_guide"
												type="button"
											>
												Guide Me
											</button>
										</g>
										<div class="row medium_margin">
											<div
												id="problem1qualmodel_myDiagramDiv2"
												style={{
													backgroundColor:
														'whitesmoke',
													border: 'solid 1px black',
													width: '95%',
													height: '360px',
													marginBottom: '10px',
												}}
											></div>
											<button
												type="button"
												class="btn btn-primary btn-sm editable-submit"
												onclick="save()"
											>
												<i class="glyphicon glyphicon-ok"></i>
											</button>
											<button
												type="button"
												class="btn btn-default btn-sm editable-cancel"
												onclick="clearData()"
											>
												<i class="glyphicon glyphicon-remove"></i>
											</button>
										</div>
									</div>
									<div
										class="medium_margin"
										style={{ width: '550px' }}
									>
										<button
											style={{ float: 'right' }}
											onclick="openqualeval();"
											class="btn"
											id="problem1qualmodel_next"
											type="button"
										>
											Check your causal map
										</button>
									</div>
									-
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

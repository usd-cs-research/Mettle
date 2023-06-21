import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function IntroScreenMainSection() {
	const navigate = useNavigate();

	const handleContinue = () => {
		navigate('/session');
	};

	const handleLogout = () => {
		navigate('/');
	};
	return (
		<div className="intro--maincontent">
			<div className="info">
				<p>
					Today you will learn about engineering estimation and how to
					solve estimation problems
				</p>
			</div>
			<div className="intro-list--container">
				<span
					className="maincontent-text"
					style={{ fontSize: '16px', fontWeight: '400' }}
				>
					<ul>
						<li>
							Estimation is the process of determining approximate
							values (say, to the right order of magnitude) for a
							physical quantity in a physical system without
							complete information and knowledge of the context.
						</li>
						<li>
							Estimation is often done as a first step in design,
							to establish the feasibility of an idea or to
							evaluate if a component can be used in the design.
						</li>
						<li>
							The emphasis in estimation is on “speed” and
							“reasonableness”. In other words, we would rather
							have an approximate number quickly rather than do
							elaborate time-consuming calculations to get the
							exact number because approximate numbers are
							sufficient to make decisions and move forward in the
							design process. A good way to get a useful estimate
							is to consider the “worst case” scenario and find
							the maximum value for a parameter. So think about
							what is the worst case scenario and when is the
							parameter value likely to be the highest.
						</li>
						<li>
							Practicing engineers often make such estimates on
							the job for many quantities such as power required,
							time required, speed attainable, weight of an
							object, etc. When you graduate and begin working you
							will be required to make such estimates on the job.
						</li>
						<li>
							In addition to being able to estimate quantities,
							you must be able to evaluate if the value for a
							physical quantity “makes sense” or is reasonable in
							the given context.
						</li>
					</ul>
				</span>
			</div>
			<button className="default--button" onClick={handleContinue}>
				Continue
			</button>
			<button className="default--button" onClick={handleLogout}>
				Log Out
			</button>
		</div>
	);
}

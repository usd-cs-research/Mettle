import React from 'react';

const DiagramComponent = () => {
	const handleSingleClick = (elementId) => {
		document.getElementById(elementId).style.visibility = 'visible';
	};

	const handleDoubleClick = (elementId) => {
		document.getElementById(elementId).style.visibility = 'hidden';
	};

	return (
		<div className="svg--container">
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
					onClick={() => handleSingleClick('func_desc')}
					onDoubleClick={() => handleDoubleClick('func_desc')}
				>
					<polygon points="0,250 0,500 250,500" className="task_map">
						<title>
							What does the heart need to do? that requires power?
						</title>
					</polygon>
					<text x="5" y="430" className="task_text">
						Functional Modeling
					</text>
				</g>

				<g
					onClick={() => handleSingleClick('qual_desc')}
					onDoubleClick={() => handleDoubleClick('qual_desc')}
				>
					<polygon
						points="0,0 0,250 250,500 500,500"
						className="task_map"
					>
						<title>
							What are the dominant parameters that affect power?
						</title>
					</polygon>
					<text x="100" y="300" className="task_text">
						Qualitative Modeling
					</text>
				</g>
				<g
					onClick={() => handleSingleClick('quant_desc')}
					onDoubleClick={() => handleDoubleClick('quant_desc')}
				>
					<polygon
						points="250,0 250,250 500,500 500,250"
						className="task_map"
					>
						<title>
							What is the equation connecting power required to
							the dominant parameters?
						</title>
					</polygon>
					<text x="290" y="250" className="task_text">
						Quantitative Modeling
					</text>
				</g>

				<g
					onClick={() => handleSingleClick('calc_desc')}
					onDoubleClick={() => handleDoubleClick('calc_desc')}
				>
					<polygon points="0,0 250,250 250,0" className="task_map">
						<title>
							Substituting reasonable values in the equation, what
							is the estimate of power?
						</title>
					</polygon>
					<text x="120" y="90" className="task_text">
						Calculation
					</text>
				</g>

				<g
					onClick={() => handleSingleClick('eval_desc')}
					onDoubleClick={() => handleDoubleClick('eval_desc')}
				>
					<polygon points="250,0 500,250 500,0" className="task_map">
						<title x="360" y="50" className="task_text_eg">
							Is the estimated value of power reasonable?
						</title>
					</polygon>
					<text x="380" y="90" className="task_text">
						Evaluation
					</text>
				</g>
			</svg>
		</div>
	);
};

export default DiagramComponent;

import React, { useState } from 'react';
import './diagramcomponent.css';
import { sessionSocket } from '../../services/socket';
import { useNavigate, useLocation } from 'react-router-dom';
import loggerService from '../../services/loggerService';
import { triggerAutoRoleSwitch } from '../../utils/autoRoleSwitch';

const DynamicDiagramComponent = (props) => {
	// Note: Removed useActionLogger() to prevent duplicate logs from child SVG elements
	// We'll log clicks manually in clickHandler when they reach the <g> element with the ID
	
	const role = localStorage.getItem('role');
	const collaborationMode = localStorage.getItem('collaborationMode') || 'individual';
	const [visibleSubQuestions, setVisibleSubQuestions] = useState({
		functional: false,
		qualitative: false,
		quantitative: false,
		evaluation: false,
		calculation: false,
	});
	const navigate = useNavigate();
	const location = useLocation();
	const clickTimeout = React.useRef(null);

	const clickHandler = (event) => {
		// ✅ Stop event bubbling to prevent it from propagating beyond this component
		event.stopPropagation();
		
		// ✅ CRITICAL FIX: Store event properties before timeout (event becomes null in async callbacks)
		const target = event.currentTarget;
		const isDisabled = target.classList.contains('disabled');
		const id = target.id;
		
		// Clear any pending single-click action
		if (clickTimeout.current) {
			clearTimeout(clickTimeout.current);
			clickTimeout.current = null;
			return; // This was actually a double-click
		}

		if (isDisabled) {
			return;
		}

		// Delay single-click action to allow double-click detection
		clickTimeout.current = setTimeout(() => {
			
			// Manually log the click with correct element info
			if (loggerService.isActive) {
				loggerService.logClick(target, 'DynamicDiagramComponent');
			}

			// Only emit socket event in collaborative mode
			if (collaborationMode === 'collaborative') {
				sessionSocket.emit('forward', {
					eventDesc: 'problem--subquestion--click',
					sessionId: props.sessionId,
					data: {
						functional: false,
						qualitative: false,
						quantitative: false,
						evaluation: false,
						calculation: false,
						[id]: !visibleSubQuestions[id],
					},
				});
			}

			setVisibleSubQuestions({
				functional: false,
				qualitative: false,
				quantitative: false,
				evaluation: false,
				calculation: false,
				[id]: !visibleSubQuestions[id],
			});
			
			clickTimeout.current = null;
		}, 250); // 250ms delay
	};

  	const doubleClickHandler = (event) => {
		const isDisabled = event.currentTarget.classList.contains('disabled');
		
		if (isDisabled) {
			return;
		}

		const id = event.currentTarget.id;
		
		try {
			loggerService.log('subgoal_tile_doubleclick', { 
				subgoalId: id, 
				component: 'DynamicDiagramComponent',
				navigation: true 
			});
		} catch (error) {
			// Silently handle logging errors
		}

		// Navigate based on the tile ID
		const sessionId = props.sessionId || props.session;
		let targetPath = '';
		
		if (id === 'functional') {
			targetPath = `/${sessionId}/problem/functional`;
		} else if (id === 'qualitative') {
			targetPath = `/${sessionId}/problem/qualitative`;
		} else if (id === 'quantitative') {
			targetPath = `/${sessionId}/problem/quantitative`;
		} else if (id === 'calculation') {
			targetPath = `/${sessionId}/problem/calculation/calculation`;
		} else if (id === 'evaluation') {
			targetPath = `/${sessionId}/problem/evaluation/evaluation`;
		}

		// Check if this is a cross-section navigation that should trigger role switch
		const currentPath = location.pathname;
		const isMainTileNavigation = ['functional', 'qualitative', 'quantitative', 'calculation', 'evaluation'].includes(id);
		
		if (isMainTileNavigation && targetPath) {
			// Trigger automatic role switch for main tile navigation
			triggerAutoRoleSwitch(sessionId, currentPath, targetPath, collaborationMode);
		}

		navigate(targetPath);
	};
	
	// Only set up socket listeners in collaborative mode
	if (collaborationMode === 'collaborative') {
		sessionSocket.on('forward', (data) => {
			if (data.eventDesc === 'problem--navigate--subquestion') {
				navigate(data.path);
			}
		});

		sessionSocket.on('forward', (data) => {
			if (data.eventDesc === 'problem--subquestion--click') {
				setVisibleSubQuestions(data.data);
			}
		});
	}

	const unclickableStyle = {
		pointerEvents: 'none',
	};
	
	// Determine if tiles should be clickable
	const isClickable = collaborationMode === 'individual' || role !== 'Navigator';
	const tileStyle = isClickable ? {cursor: 'pointer'} : unclickableStyle;

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
						onDoubleClick={doubleClickHandler}
						style={tileStyle}
					>
						<polygon
							points="0,250 0,500 250,500"
							className="task_map"
							style={{cursor: 'pointer'}}
						>
							<title>{props.functional}</title>
						</polygon>
						<text x="5" y="430" className="task_text" style={{cursor: 'pointer'}}>
							Functional Modeling
						</text>
					</g>

					<g
						id="qualitative"
						onClick={clickHandler}
						onDoubleClick={doubleClickHandler}
						style={tileStyle}
					>
						<polygon
							points="0,0 0,250 250,500 500,500"
							className="task_map"
							style={{cursor: 'pointer'}}
						>
							<title>{props.qualitative}</title>
						</polygon>
						<text x="100" y="300" className="task_text" style={{cursor: 'pointer'}}>
							Qualitative Modeling
						</text>
					</g>
					<g
						id="quantitative"
						onDoubleClick={doubleClickHandler}
						onClick={clickHandler}
						style={tileStyle}
					>
						<polygon
							points="250,0 250,250 500,500 500,250"
							className="task_map"
							style={{cursor: 'pointer'}}
						>
							<title>{props.quantitative}</title>
						</polygon>
						<text x="290" y="250" className="task_text" style={{cursor: 'pointer'}}>
							Quantitative Modeling
						</text>
					</g>

					<g
						id="calculation"
						onDoubleClick={doubleClickHandler}
						onClick={clickHandler}
						style={tileStyle}
					>
						<polygon
							points="0,0 250,250 250,0"
							className="task_map"
							style={{cursor: 'pointer'}}
						>
							<title>{props.calculation}</title>
						</polygon>
						<text x="120" y="90" className="task_text" style={{cursor: 'pointer'}}>
							Calculation
						</text>
					</g>

					<g
						id="evaluation"
						onDoubleClick={doubleClickHandler}
						onClick={clickHandler}
						style={tileStyle}
					>
						<polygon
							points="250,0 500,250 500,0"
							className="task_map"
							style={{cursor: 'pointer'}}
						>
							<title x="360" y="50" className="task_text_eg">
								{props.evaluation}
							</title>
						</polygon>
						<text x="380" y="90" className="task_text" style={{cursor: 'pointer'}}>
							Evaluation
						</text>
					</g>
				</svg>
			</div>
			<>
				<div className="diagram-component">
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
				</div>
			</>
		</>
	);
};

export default DynamicDiagramComponent;

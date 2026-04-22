import React, { useEffect, useState } from 'react';
import { sessionSocket } from '../../services/socket';

export default function MyMenu(props) {
	const [menuVisible, setMenuVisible] = useState(false);

	useEffect(() => {
		const handleForward = (data) => {
			if (data.eventDesc === 'mymenu-openclose') {
				setMenuVisible(data.value);
			}
		};

		sessionSocket.on('forward', handleForward);

		return () => {
			sessionSocket.off('forward', handleForward);
		};
	}, []);

	const variant = props.variant || 'default';
	const isScribbleVariant = variant === 'scribble-pad';

	return (
		<>
			<div
				className={
					isScribbleVariant
						? 'scribble-menu'
						: 'problem-statement-menu'
				}
			>
				<button
					id={isScribbleVariant ? undefined : 'menuTrigger'}
					className={
						isScribbleVariant
							? 'scribble-menu-trigger'
							: 'problem-statement-menu__trigger'
					}
					onClick={() => {
						setMenuVisible(!menuVisible);
						sessionSocket.emit('forward', {
							sessionId: `${localStorage.getItem('sessionId')}`,
							eventDesc: 'mymenu-openclose',
							value: !menuVisible,
						});
					}}
				>
					{props.buttonLabel || 'Problem Statement'}
				</button>

				<div
					id={isScribbleVariant ? undefined : 'myMenu'}
					className={
						isScribbleVariant
							? `scribble-menu-panel ${
									menuVisible
										? 'scribble-menu-panel--show'
										: ''
							  }`
						: `menu ${menuVisible ? 'show' : ''}`
					}
				>
					{isScribbleVariant && (
						<div className="scribble-menu-panel__label">
							Problem Statement
						</div>
					)}
					<div
						className={
							isScribbleVariant
								? 'scribble-menu-panel__content'
								: 'problem-statement-menu__content'
						}
					>
						{props.question}
					</div>
				</div>
			</div>
		</>
	);
}

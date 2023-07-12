import React, { useState } from 'react';
import { sessionSocket } from '../../services/socket';

export default function MyMenu(props) {
	const [menuVisible, setMenuVisible] = useState(false);
	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'mymenu-openclose') {
			setMenuVisible(data.value);
			console.log('AHAHAHAHHA', data.value);
		}
	});

	return (
		<>
			<div className="col-lg-4">
				<button
					id="menuTrigger"
					onClick={() => {
						setMenuVisible(!menuVisible);
						sessionSocket.emit('forward', {
							sessionId: `${localStorage.getItem('sessionId')}`,
							eventDesc: 'mymenu-openclose',
							value: !menuVisible,
						});
					}}
				>
					Problem Statement
				</button>

				<div
					id="myMenu"
					className={`menu ${menuVisible ? 'show' : ''}`}
				>
					{props.question}
				</div>
			</div>
		</>
	);
}

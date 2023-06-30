import React from 'react';
import Header from '../../components/global/header';
import { sessionSocket } from '../../services/socket';

export default function SocketTestScreen() {
	const click1Handler = () => {
		sessionSocket.connect(() => {
			console.log('SOCKET CONNECTED');
		});
	};

	const click2handler = () => {
		sessionSocket.emit('join', {
			sessionId: 'randomstring',
		});
		console.log('join emitted');
	};
	return (
		<>
			<Header />
			<div className="maincontent">
				<button className="default--button" onClick={click1Handler}>
					Action 1
				</button>
				<button className="default--button" onClick={click2handler}>
					Action 2
				</button>
				<button className="default--button">Action 3</button>
				<button className="default--button">Action 4</button>
			</div>
		</>
	);
}

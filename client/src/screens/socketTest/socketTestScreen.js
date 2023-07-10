import React from 'react';
import Header from '../../components/global/header';
import { sessionSocket } from '../../services/socket';

console.log(sessionSocket);

export default function SocketTestScreen() {
	sessionSocket.on('connect', () => {
		console.log('SOCKET CONNECTED');
	});

	sessionSocket.on('global', (data) => {
		console.log('GLOABL RECIEVED', data);
	});

	const click1Handler = () => {
		sessionSocket.connect();
	};

	const click2Handler = () => {
		sessionSocket.emit('global', {
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
				<button className="default--button" onClick={click2Handler}>
					Action 2
				</button>
				<button className="default--button">Action 3</button>
				<button className="default--button">Action 4</button>
			</div>
		</>
	);
}

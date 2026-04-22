import React from 'react';
import Header from '../../components/global/header';
import { sessionSocket } from '../../services/socket';


export default function SocketTestScreen() {
	sessionSocket.on('connect', () => {
	});

	sessionSocket.on('global', (data) => {
	});

	const click1Handler = () => {
		sessionSocket.connect();
	};

	const click2Handler = () => {
		sessionSocket.emit('global', {
			sessionId: 'randomstring',
		});
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

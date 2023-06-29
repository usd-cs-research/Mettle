import React from 'react';
import Header from '../../components/global/header';

export default function SocketTestScreen() {
	return (
		<>
			<Header />
			<div className="maincontent">
				<button className="default--button">Action 1</button>
				<button className="default--button">Action 2</button>
				<button className="default--button">Action 3</button>
				<button className="default--button">Action 4</button>
			</div>
		</>
	);
}

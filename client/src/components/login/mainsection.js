import React from 'react';
import LoginCard from './logincard';

export default function LoginMainSection() {
	return (
		<main>
			<div
				className="content-wrap"
				style={{
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<span
					className="maincontent-text"
					style={{ fontSize: '16px', fontWeight: '400' }}
				>
					In MEttLE, you will solve some problems and learn how to do
					engineering estimation. <br />
					Login to begin learning.
				</span>
				<LoginCard />
				<span
					className="maincontent-text"
					style={{ fontSize: '16px', fontWeight: '400' }}
				>
					Not Registered? <a href="/register">Click Here!!</a>
				</span>
			</div>
		</main>
	);
}

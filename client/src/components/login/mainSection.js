import React from 'react';
import LoginCard from './loginCard';
import { IoArrowBack } from "react-icons/io5";
export default function LoginMainSection() {
	return (
		<main>
			<div>
				<a
					href="/"
					style={{
						fontSize: '24px',
						color: 'white',
						textDecoration: 'none',
						display: 'inline-flex',
						alignItems: 'center',
						cursor: 'pointer',
					}}
				>
					<IoArrowBack />
				</a>
			</div>
			<div
				className="content-wrap"
				style={{
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
					engineering estimation. Login to begin learning.
				</span>
				<LoginCard />
				<span
					className="maincontent-text"
					style={{ fontSize: '16px', fontWeight: '400' }}
				>
					Not Registered? <button className="box3" onClick={() => window.location.href = "/register"}>Click Here</button>
				</span>
			</div>
		</main>
	);
}

import React from 'react';
import SignupCard from './signupcard';

export default function SignupMainSection() {
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
					Kindly ask the administrator to type in the admin key and
					register below.
				</span>
				<SignupCard />
				<span
					className="maincontent-text"
					style={{ fontSize: '16px', fontWeight: '400' }}
				>
					Already Registered? &nbsp;
					<a href="/login">Click Here to Login!!</a>
				</span>
			</div>
		</main>
	);
}

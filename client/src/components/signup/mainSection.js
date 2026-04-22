import React from 'react';
import SignupCard from './signupCard';
import { IoArrowBack } from "react-icons/io5";
export default function SignupMainSection(props) {
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
					Kindly ask the administrator to type in the admin key and
					register below.
				</span>
				<SignupCard type={props.type} />
				<span
					className="maincontent-text"
					style={{ fontSize: '16px', fontWeight: '400' }}
				>
					Already Registered? &nbsp;
					 <button className="box3" onClick={() => window.location.href = "/login"}>Click Here to Login</button>
				</span>
			</div>
		</main>
	);
}

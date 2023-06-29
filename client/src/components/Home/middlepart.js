import React from 'react';

export default function MiddlePart() {
	return (
		<div className="register" style={{ height: '46%' }}>
			<div className="info">
				<p>Welcome to MEttLE</p>
			</div>
			<div className="container-fluid" style={{ height: '100%' }}>
				<div
					style={{
						textAlign: 'center',
						margin: 'auto',
						height: '100%',
						marginTop: '40px',
					}}
				>
					<div
						className="content-wrap"
						style={{
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							flexDirection: 'column',
						}}
					>
						<span style={{ fontSize: '16px', fontWeight: '400' }}>
							Kindly ask the administrator to type in the admin
							key and register or sign in.
						</span>
						<div
							className="col-lg-2"
							style={{ textAlign: 'center' }}
						>
							<a href="/login">Sign In</a> |{' '}
							<a href="/register">Sign Up</a>
						</div>
						<div className="welcome">Welcome to MEttLE.</div>
						<div>
							<br />
							<span
								style={{ fontSize: '16px', fontWeight: '400' }}
							>
								Looking to register as a teacher?{' '}
								<a href="/teacherregister">Click Here</a>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

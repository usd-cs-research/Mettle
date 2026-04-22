import React from 'react';
import './middle.css';

export default function MiddlePart() {
	return (
		<section className="home-middle">
			<div className="home-middle__glow home-middle__glow--one"></div>
			<div className="home-middle__glow home-middle__glow--two"></div>

			<div className="home-middle__shell">
				<div className="home-middle__eyebrow">Get Started</div>
				<h2 className="home-middle__title">
					Step into a cleaner estimation workspace
				</h2>
				<p className="home-middle__lead">
					Ask the administrator to enter the admin key, then choose
					how you want to continue with MEttLE.
				</p>

				<div className="home-middle__actions">
					<button
						onClick={() => {
							window.location.href = '/login';
						}}
						className="home-middle__button home-middle__button--primary"
					>
						Sign In
					</button>
					<div className="home-middle__separator">or</div>
					<button
						onClick={() => {
							window.location.href = '/register';
						}}
						className="home-middle__button home-middle__button--secondary"
					>
						Sign Up
					</button>
				</div>

				<div className="home-middle__welcome">Welcome to MEttLE!</div>

				<div className="home-middle__teacher-card">
					<div className="home-middle__teacher-copy">
						Looking to register as a teacher?
					</div>
					<a href="/teacherregister" className="home-middle__teacher-link">
						Click Here
					</a>
				</div>
			</div>
		</section>
	);
}

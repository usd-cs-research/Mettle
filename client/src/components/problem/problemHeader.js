import React from 'react';
import driverPng from '../../assets/images/steering-wheel.png';
import navigatorPng from '../../assets/images/navigator-compass.png';
import './problemscreens.css';
import LogoutButton from '../global/logoutButton';

export default function ProblemHeader() {
	const role = localStorage.getItem('role');
	return (
		<header>
			<div className="top-section">
				<div className="row">
					<div className="col-sm-2 problem-header-main">
						<img
							className="hoverable-image"
							src={role === 'Driver' ? driverPng : navigatorPng}
						/>
					</div>
					<div className="col-sm-10 problem-header-main">
						<p>MEttLE</p>
					</div>
				</div>
			</div>
		</header>
	);
}

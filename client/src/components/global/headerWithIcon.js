import React from 'react';
import driverPng from '../../assets/images/steering-wheel.png';
import navigatorPng from '../../assets/images/navigator-compass.png';

export default function Header() {
	const role = localStorage.getItem('role');
	const roleData =
		role === 'Driver'
			? 'You are currently the Driver so you are the one who interacts with the page and submits inputs.'
			: 'You are currently the Navigator so you have to discuss with the driver and cannot interact with the page.';

	return (
		<header>
			<div className="top-section">
				<div className="row problem-top-section">
					<div className="col-sm-1 ">
						<img
							className="hoverable-image"
							src={role === 'Driver' ? driverPng : navigatorPng}
							title={roleData}
							alt="Role"
						/>
					</div>
					<div
						className="col-sm-11 main--header"
						style={{ margin: 'auto', textAlign: 'center' }}
					>
						<h2>
							Modeling-Based Estimation Learning Environment
							(MEttLE)
						</h2>
					</div>
				</div>
			</div>
		</header>
	);
}

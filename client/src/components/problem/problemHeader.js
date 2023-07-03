import React from 'react';
import driverPng from '../../assets/images/steering-wheel.png';
import navigatorPng from '../../assets/images/navigator-compass.png';
import infocenterPng from '../../assets/images/info.png';
import problemmapPng from '../../assets/images/map.png';
import scribblepadPng from '../../assets/images/scribble.png';
import { useNavigate, useParams } from 'react-router-dom';

import './problemscreens.css';
import LogoutButton from '../global/logoutButton';

export default function ProblemHeader() {
	const role = localStorage.getItem('role');
	const navigate = useNavigate();
	const { sessionId } = useParams();

	const roleData =
		role === 'Driver'
			? 'You are currently the Driver so you are the one who interacts with the page and submits inputs.'
			: 'You are currently the Navigator so you have to discuss with the driver and cannot interact with the page.';

	return (
		<header>
			<div className="top-section ">
				<div className="row problem-top-section">
					<div className="col-sm-1 ">
						<img
							className="hoverable-image"
							src={role === 'Driver' ? driverPng : navigatorPng}
							title={roleData}
							alt="Role"
						/>
					</div>
					<div className="col-sm-5 problem-header-main">
						<p>MEttLE</p>
					</div>
					<div className="col-sm-1 problem-header-main">
						<img
							id="problem1funcmodel_info"
							src={infocenterPng}
							style={{ cursor: 'pointer' }}
							alt="Info Center"
						/>
					</div>

					<div className="col-sm-1 problem-header-main">
						<img
							id="problem1funcmodel_scribble"
							src={scribblepadPng}
							onClick={() => {
								navigate(`/${sessionId}/problem/notes`);
							}}
							style={{ cursor: 'pointer' }}
							alt="Scribble Pad"
						/>
					</div>

					<div className="col-sm-1 problem-header-main">
						<img
							id="problem1funcmodel_map"
							src={problemmapPng}
							style={{ cursor: 'pointer' }}
							alt="Problem Map"
						/>
					</div>
					<div className="col-sm-1 problem-header-main">
						<button className="default--button">Switch User</button>
					</div>
					<div className="col-sm-1 problem-header-main">
						<button className="default--button">
							Save Session
						</button>
					</div>
					<div className="col-sm-1 problem-header-main">
						<LogoutButton />
					</div>
				</div>
			</div>
		</header>
	);
}

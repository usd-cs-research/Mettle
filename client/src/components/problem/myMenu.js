import React, { useState } from 'react';

export default function MyMenu() {
	const [menuVisible, setMenuVisible] = useState(false);

	return (
		<>
			<div className="col-lg-4">
				<button
					id="menuTrigger"
					onClick={() => setMenuVisible(!menuVisible)}
				>
					Problem Statement
				</button>

				<div
					id="myMenu"
					className={`menu ${menuVisible ? 'show' : ''}`}
				>
					You are participating in an electric car race in which you
					are required to design an electric car of weight 5kg with
					wheel diameters of 4” that can traverse a track of 50m in
					less than 5 seconds. <br />
					Estimate the electrical power needed to achieve this
					performance.
				</div>
			</div>
		</>
	);
}

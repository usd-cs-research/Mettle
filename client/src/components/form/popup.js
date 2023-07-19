import React from 'react';
import './popup.css';

const Popup = ({ setShowPopup }) => {
	const handleClose = () => {
		setShowPopup(false);
	};

	return (
		<div className="popup-container">
			<div className="popup-content">
				<h3 className="popup-heading">Attention</h3>
				<p className="popup-message">
					Please fill all fields before saving.
				</p>
				<button className="popup-close-button" onClick={handleClose}>
					Close
				</button>
			</div>
		</div>
	);
};

export default Popup;

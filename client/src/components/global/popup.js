import React, { useEffect } from 'react';
import './popup.css';

const Popup = ({ type, message }) => {
	return (
		<div
			id="popup"
			className={`popup--component ${
				type === 'red' ? 'pc--red' : 'pc-green'
			}`}
		>
			{message}
		</div>
	);
};

export default Popup;

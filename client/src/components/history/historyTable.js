import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HistoryTable(props) {
	const navigate = useNavigate();
	const openSession = () => {
		navigate('/roles');
	};

	const tableBody = props.data.map((item, index) => (
		<tr key={index} id={`row${index}`}>
			<td id={`row${index}d0`}>{item.sessionID.sessionName}</td>
			<td id={`row${index}d1`}>{item.sessionID.createdAt}</td>
			<td>
				<button
					className="history--table--open--btn"
					data-row={index}
					onClick={openSession}
				>
					Open
				</button>
			</td>
		</tr>
	));

	return (
		<div className="table-container">
			<h2 className="table-title">Previous Sessions</h2>
			<table id="history--table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Date and Time</th>
						<th>Open</th>
					</tr>
				</thead>
				<tbody>{tableBody}</tbody>
			</table>
		</div>
	);
}

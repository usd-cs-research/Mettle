import React from 'react';

export default function HistoryTable(props) {
	const tableBody = props.data.map((item, index) => (
		<tr key={index} id={`row${index}`}>
			<td id={`row${index}d0`}>{item.sessionID}</td>
			<td id={`row${index}d1`}>{item.date}</td>
			<td>
				<button className="history--table--open--btn" data-row={index}>
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

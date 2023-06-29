import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HistoryTable(props) {
	const navigate = useNavigate();
	const apiurl = process.env.REACT_APP_API_URL;

	const openSession = async (event) => {
		const buttonId = event.target.id;
		const sessionId = buttonId.split('-')[1];

		navigate(`/${sessionId}/roles`);
	};

	const deleteSession = async (event) => {
		const buttonId = event.target.id;
		const sessionId = buttonId.split('-')[1];

		try {
			const response = await fetch(
				`${apiurl}/session/delete?sessionId=${sessionId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'token',
						)}`,
						'Content-Type': 'application/json',
					},
				},
			);

			if (!response.ok) {
				alert('Delete request failed');
				throw new Error('Delete request failed');
			}
		} catch (error) {
			console.error(error);
		}

		alert('Deletion successful!');
		props.reloadFunc();
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
					id={`openButton-${item.sessionID._id}`}
				>
					Open
				</button>
				<button
					className="history--table--open--btn"
					data-row={index}
					onClick={deleteSession}
					id={`deleteButton-${item.sessionID._id}`}
				>
					Delete
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
						<th>Action</th>
					</tr>
				</thead>
				<tbody>{tableBody}</tbody>
			</table>
		</div>
	);
}

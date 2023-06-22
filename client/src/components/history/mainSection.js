import React from 'react';
import HistoryTable from './historyTable';

export default function HistoryMainSection() {
	const apiurl = process.env.REACT_APP_API_URL;

	const demoData = [
		{
			sessionID: 'ABCD',
			date: '1234',
		},
	];

	const getPrevSessionData = async () => {
		try {
			const response = await fetch(`${apiurl}/session/list`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('token'),
				},
			});
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();

			return data;
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<div className="top-section">
				<div className="col-lg-2" style={{ textAlign: 'center' }}>
					<a href="/intro">Welcome</a> |{' '}
					<a href="/register">Sign Out</a>
				</div>
			</div>
			<div className="info">
				<p>Previous Sessions</p>
			</div>
			<div className="history--table--container">
				<HistoryTable data={demoData} />
			</div>
		</>
	);
}

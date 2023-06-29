import React, { useEffect, useState } from 'react';
import HistoryTable from './historyTable';

export default function HistoryMainSection() {
	const apiurl = process.env.REACT_APP_API_URL;

	const [sessionsData, setSessionsData] = useState({});

	const getPrevSessionData = async () => {
		try {
			const response = await fetch(`${apiurl}/session/list`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			setSessionsData(data);
			console.log(sessionsData);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getPrevSessionData();
	}, [apiurl]);

	return (
		<>
			<div className="top-section" id="history--top-section">
				<div className="col-lg-2" style={{ textAlign: 'center' }}>
					<a href="/intro">Welcome</a> |{' '}
					<a href="/register">Sign Out</a>
				</div>
			</div>
			<div className="info">
				<p>Previous Sessions</p>
			</div>
			<div className="history--table--container">
				{Object.keys(sessionsData).length !== 0 ? (
					<HistoryTable
						data={sessionsData}
						reloadFunc={getPrevSessionData}
					/>
				) : (
					<h1>No Previous Sessions</h1>
				)}
			</div>
		</>
	);
}

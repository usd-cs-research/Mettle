import React, { useState } from 'react';
import ProblemHeader from '../../components/problem/problemHeader';
import MyMenu from '../../components/problem/myMenu';
import { useNavigate, useParams } from 'react-router-dom';
import { sessionSocket } from '../../services/socket';

export default function ScribblePadScreen() {
	const [textAreaContent, setTextAreaContent] = useState('');
	const navigate = useNavigate();
	const { sessionId } = useParams();
	const apiurl = process.env.REACT_APP_API_URL;
	const role = localStorage.getItem('role');

	const handleChange = (event) => {
		const data = event.target.value;

		sessionSocket.emit('forward', {
			sessionId: sessionId,
			eventDesc: 'notepad-typing',
			value: data,
		});

		setTextAreaContent(data);
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'notepad-typing') {
			setTextAreaContent(data.value);
		}

		if (data.eventDesc === 'notepad-redirect-back') {
			navigate(`/${sessionId}/problem`);
		}
	});

	const handleBack = () => {
		navigate(`/${sessionId}/problem`);
		sessionSocket.emit('forward', {
			eventDesc: 'notepad-redirect-back',
			sessionId: sessionId,
		});
	};

	const handleSave = async () => {
		try {
			await fetch(`${apiurl}/session/notes?sessionId=${sessionId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({ notes: textAreaContent }),
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<ProblemHeader />
			<div className="info">
				<p className="col-lg-8 problem-info">Take Notes Here</p>
				<MyMenu />
			</div>
			<textarea
				rows="20"
				cols="100"
				style={{ margin: '10px auto', display: 'flex' }}
				onChange={handleChange}
				value={textAreaContent}
				disabled={role === 'Navigator'}
			></textarea>
			<div className="container-fluid">
				<button
					className="default--button"
					onClick={handleSave}
					disabled={role === 'Navigator'}
				>
					Save
				</button>
				<button
					className="default--button"
					onClick={handleBack}
					disabled={role === 'Navigator'}
				>
					Back
				</button>
			</div>
		</>
	);
}

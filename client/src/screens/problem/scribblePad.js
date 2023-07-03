import React, { useState } from 'react';
import ProblemHeader from '../../components/problem/problemHeader';
import MyMenu from '../../components/problem/myMenu';
import { useNavigate, useParams } from 'react-router-dom';

export default function ScribblePadScreen() {
	const [textAreaContent, setTextAreaContent] = useState('');
	const navigate = useNavigate();
	const { sessionId } = useParams();

	const handleChange = (event) => {
		const data = event.target.value;

		setTextAreaContent(data);
	};

	const handleBack = () => {
		navigate(`/${sessionId}/problem`);
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
			>
				{textAreaContent}
			</textarea>
			<div className="container-fluid">
				<button className="default--button">Save</button>
				<button className="default--button" onClick={handleBack}>
					Back
				</button>
			</div>
		</>
	);
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemCard from './problemCard';

export default function TeacherSelectProblemMainSection() {
	const [questionData, setQuestionsData] = useState([]);
	const type = 'teacher';
	const navigate = useNavigate();
	const apiurl = process.env.REACT_APP_API_URL;

	const newquestionHandler = () => {
		navigate('/question');
	};

	useEffect(() => {
		const getAllproblems = async () => {
			try {
				const response = await fetch(`${apiurl}/question/main/teacher`, {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}

				const data = await response.json();
				setQuestionsData(data.questions);
			} catch (error) {
				console.error(error);
			}
		};

		getAllproblems();
	}, [apiurl]);

	return (
		<>
			<div>
				<button className="default--button" onClick={newquestionHandler}>
					Create New Question
				</button>
			</div>
			<div className="problemcards--container">
				{questionData.map((question, key) => {
					const imgurl = question.image.startsWith('media/images')
						? `${apiurl}/${question.image}`
						: `${apiurl}/media/images/${question.image}`;

					const data = {
						question: question.question,
						imgurl,
						id: question._id,
					};

					return <ProblemCard data={data} type={type} id={key} />;
				})}
			</div>
		</>
	);
}

import React, { useEffect, useState } from 'react';
import ProblemCard from './problemCard';
import carImg from '../../assets/images/car.jpeg';
import LogoutButton from '../global/logoutButton';
import { useLocation } from 'react-router-dom';

export default function SelectProblemMainSection() {
	const [questionData, setQuestionsData] = useState([]);
	const apiurl = process.env.REACT_APP_API_URL;

	const sessionId = useLocation().pathname.replace('/selectproblem', '');

	const getAllproblems = async () => {
		try {
			const response = await fetch(`${apiurl}/question/main/student`, {
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
			console.log(data.questions);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getAllproblems();
	}, [apiurl, getAllproblems]);

	return (
		<>
			<div className="info">
				Here are some estimation problems for you to solve!
			</div>
			<div className="problemcards--container">
				{questionData.map((question, key) => {
					const data = {
						question: question.questionText,
						imgurl: carImg,
						id: question._id,
					};
					const type = 'student';
					return (
						<ProblemCard
							data={data}
							type={type}
							sessionId={sessionId}
						/>
					);
				})}
			</div>
			<LogoutButton />
		</>
	);
}

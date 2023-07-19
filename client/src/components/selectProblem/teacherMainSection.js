import React, { useEffect, useState } from 'react';
import ProblemCard from './problemCard';
import carImg from '../../assets/images/car.jpeg';
import LogoutButton from '../global/logoutButton';
import { useNavigate } from 'react-router-dom';

export default function TeacherSelectProblemMainSection() {
	const [questionData, setQuestionsData] = useState([]);

	const type = 'teacher';
	const navigate = useNavigate();

	const newquestionHandler = () => {
		navigate('/createquestion');
	};

	const mockData = {
		question:
			'You are participating in an electric car race in which you are required to design an electric car of weight 5kg with wheel diameters of 4” that can traverse a track of 50m in less than 5 seconds. Estimate the electrical power needed to achieve this performance. ',
		imgUrl: carImg,
	};
	const apiurl = process.env.REACT_APP_API_URL;

	useEffect(() => {
		const getAllproblems = async () => {
			try {
				const response = await fetch(
					`${apiurl}/question/main/teacher`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				);
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
			<div className="info">Here are your estimation problems!</div>
			<div>
				<button
					className="default--button"
					onClick={newquestionHandler}
				>
					Create New Question
				</button>
			</div>
			<div className="problemcards--container">
				{questionData.map((question, key) => {
					const data = {
						question: question.question,
						imgurl: `${apiurl}/${question.image}`,
						id: question._id,
					};
					return <ProblemCard data={data} type={type} id={key} />;
				})}
			</div>
			<LogoutButton />
		</>
	);
}

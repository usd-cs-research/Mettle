import React from 'react';
import ProblemCard from './problemCard';
import carImg from '../../assets/images/car.jpeg';

export default function SelectProblemMainSection() {
	const mockData = {
		question:
			'You are participating in an electric car race in which you are required to design an electric car of weight 5kg with wheel diameters of 4” that can traverse a track of 50m in less than 5 seconds. Estimate the electrical power needed to achieve this performance. ',
		imgUrl: carImg,
	};
	return (
		<>
			<div className="info">
				Here are some estimation problems for you to solve!
			</div>
			<div className="problemcards--container">
				<ProblemCard data={mockData} />
			</div>
			<button className="default--button">Log Out</button>
		</>
	);
}

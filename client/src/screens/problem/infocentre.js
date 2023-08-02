import React, { useEffect, useState } from 'react';
import './infocentre.css';
import ProblemHeader from '../../components/problem/problemHeader';

const QuestionFilesScreen = () => {
	const apiurl = process.env.REACT_APP_API_URL;
	const [selectedImageURL, setSelectedImageURL] = useState('');
	const [selectedPDFURL, setPdf] = useState('');

	useEffect(() => {
		// Fetch the question files (image and pdf) data here using the questionId from localStorage
		const fetchQuestionFiles = async () => {
			try {
				const questionId = localStorage.getItem('questionId');
				if (!questionId) return;

				const res = await fetch(
					`${apiurl}/question/main?questionId=${questionId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				);

				const data = await res.json();
				console.log(data);
				console.log(data.question.image); // Check the data structure and property values

				// Construct the image and PDF URLs and store them in state
				if (data.question.image) {
					if (data.question.image.startsWith('media/images')) {
						setSelectedImageURL(`${apiurl}/${data.question.image}`);
					} else {
						setSelectedImageURL(
							`${apiurl}/media/images/${data.question.image}`,
						);
					}
				}

				// Construct the PDF URL and store it in state
				if (data.question.info) {
					if (data.question.info.startsWith('media/pdfs')) {
						setPdf(`${apiurl}/${data.question.info}`);
					} else {
						setPdf(`${apiurl}/media/pdfs/${data.question.info}`);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchQuestionFiles();
	}, []);

	return (
		<>
			<ProblemHeader />
			<div className="container">
				{/* Left Section - Question PDF */}
				{selectedPDFURL && (
					<div className="section" style={{ paddingLeft: 40 }}>
						<p className="heading">QUESTION PDF:</p>
						<embed
							src={selectedPDFURL}
							type="application/pdf"
							width="250%"
							height="600px"
						/>
					</div>
				)}

				{/* Right Section - Question Image */}
				{selectedImageURL && (
					<div className="section">
						<p
							className="heading"
							style={{ paddingBottom: 30, paddingLeft: 40 }}
						>
							QUESTION IMAGE:
						</p>
						<img
							src={selectedImageURL}
							alt="Question"
							className="image"
						/>
					</div>
				)}
			</div>
		</>
	);
};

export default QuestionFilesScreen;

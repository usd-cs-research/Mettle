import React, { useEffect, useState } from 'react';
import './infocentre.css';
import ProblemHeader from '../../components/problem/problemHeader';

const QuestionFilesScreen = () => {
	const apiurl = process.env.REACT_APP_API_URL;
	const [selectedImageURL, setSelectedImageURL] = useState('');
	const [selectedPDFURL, setPdf] = useState('');
	const [isLoading, setIsLoading] = useState(true);

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
			} finally {
				setIsLoading(false);
			}
		};

		fetchQuestionFiles();
	}, []);

	return (
		<ProblemHeader>
			<section className="info-centre-shell">
				<div className="info-centre-header">
					<div>
						<p className="info-centre-kicker">Reference Material</p>
						<h1 className="info-centre-title">Info Centre</h1>
						<p className="info-centre-subtitle">
							Review the source material for this problem in one
							place. Use the PDF for detailed reference and the
							question image for quick visual context.
						</p>
					</div>
					<div className="info-centre-badges">
						<span className="info-centre-badge">
							{selectedPDFURL ? 'PDF available' : 'No PDF'}
						</span>
						<span className="info-centre-badge">
							{selectedImageURL ? 'Image available' : 'No image'}
						</span>
					</div>
				</div>

				{(selectedPDFURL || selectedImageURL) && (
					<div className="info-centre-grid">
						{selectedPDFURL && (
							<div className="info-centre-card">
								<div className="info-centre-card__header">
									<div>
										<p className="info-centre-card__eyebrow">
											Document
										</p>
										<h2 className="info-centre-card__title">
											Question PDF
										</h2>
										<p className="info-centre-card__description">
											Read the full supporting material and
											scroll through the document here.
										</p>
									</div>
									<span className="info-centre-card__status">
										Reference
									</span>
								</div>
								<embed
									className="info-centre-pdf-frame"
									src={selectedPDFURL}
									type="application/pdf"
								/>
							</div>
						)}

						{selectedImageURL && (
							<div className="info-centre-card info-centre-card--image">
								<div className="info-centre-card__header">
									<div>
										<p className="info-centre-card__eyebrow">
											Visual
										</p>
										<h2 className="info-centre-card__title">
											Question Image
										</h2>
										
									</div>
									<span className="info-centre-card__status">
										Preview
									</span>
								</div>
								<div className="info-centre-image-wrap">
									<img
										src={selectedImageURL}
										alt="Question"
										className="info-centre-image"
									/>
								</div>
							</div>
						)}
					</div>
				)}

				{!isLoading && !selectedPDFURL && !selectedImageURL && (
					<div className="info-centre-empty">
						<h2 className="info-centre-empty__title">
							No reference files available
						</h2>
						<p className="info-centre-empty__text">
							This problem does not currently include a PDF or
							image in the Info Centre.
						</p>
					</div>
				)}
			</section>
		</ProblemHeader>
	);
};

export default QuestionFilesScreen;

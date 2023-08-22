import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Form.css';
import Popup from './popup';

const Form = () => {
	const navigate = useNavigate();
	const [questionId, setQuestionId] = useState(null);

	const initialMiniQuestion = {
		question: '',
		hint: '',
	};

	const initialType = {
		label: '',
		id: '',
		numMiniQuestions: 1,
		miniQuestions: [], // Use an empty array, we will handle the creation of mini-questions separately
	};
	const initialSubquestion = {
		label: '',
		question: '',
		types: [initialType],
	};

	const [mainQuestion, setMainQuestion] = useState('');
	const [image, setImage] = useState(null);
	const [pdf, setPdf] = useState(null);
	const { questionId: paramQuestionId } = useParams();
	const [subquestions, setSubquestions] = useState([
		{
			label: 'Functional',
			question: '',
			types: [
				{
					label: 'Model Main',
					id: 'modelmain',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
				{
					label: 'Model Prompts',
					id: 'modelprompts',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
				{
					label: 'Evaluate Check',
					id: 'evaluatecheck',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
				{
					label: 'Evaluate Dominant',
					id: 'evaluatedominant',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
				{
					label: 'Plan',
					id: 'plan',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
			],
		},
		{
			label: 'Qualitative',
			question: '',
			types: [
				{
					label: 'Model',
					id: 'model',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
				{
					label: 'Evaluate Check',
					id: 'evaluatecheck',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
				{
					label: 'Evaluate Dominant',
					id: 'evaluatedominant',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
				{
					label: 'Plan',
					id: 'plan',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
			],
		},
		{
			label: 'Quantitative',
			question: '',
			types: [
				{
					label: 'Model',
					id: 'model',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
				{
					label: 'Evaluate Check',
					id: 'evaluatecheck',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
				{
					label: 'Evaluate Complete',
					id: 'evaluatecomplete',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
				{
					label: 'Plan',
					numMiniQuestions: 1,
					id: 'plan',
					miniQuestions: [initialMiniQuestion],
				},
			],
		},
		{
			label: 'Calculation',
			question: '',
			types: [{ label: 'Calculation' }],
		},
		{
			label: 'Evaluation',
			question: '',
			types: [
				{
					label: 'Evaluation',
					id: 'evaluation',
					numMiniQuestions: 1,
					miniQuestions: [initialMiniQuestion],
				},
			],
		},
	]);

	const [saveStatus, setSaveStatus] = useState(
		Array(subquestions.length * 25).fill(false),
	);
	const [imageURL, setImageURL] = useState(null);
	const [pdfURL, setPDFURL] = useState(null);

	const [showPopup, setShowPopup] = useState(false);

	const handleMainQuestionChange = (e) => {
		setMainQuestion(e.target.value);
	};

	const [imagePreview, setImagePreview] = useState(null);

	// Update image preview when a new image is selected
	const [selectedImageURL, setSelectedImageURL] = useState('');

	// Modify the handleImageChange function
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file); // Store the image Blob in state

		// Create the URL and set it in the state
		setImageURL(URL.createObjectURL(file));
	};

	const handlePdfChange = (e) => {
		const file = e.target.files[0];
		setPdf(file);
		setPDFURL(URL.createObjectURL(file));
	};

	const handleSubquestionChange = (subquestionIndex, e) => {
		const updatedSubquestions = [...subquestions];
		updatedSubquestions[subquestionIndex].question = e.target.value;
		setSubquestions(updatedSubquestions);
	};

	const handleNumMiniQuestionsChange = (subquestionIndex, typeIndex, e) => {
		const numMiniQuestions = parseInt(e.target.value);
		const updatedSubquestions = [...subquestions];
		const types = updatedSubquestions[subquestionIndex].types;
		
		// Update the numMiniQuestions property for the selected type
		types[typeIndex].numMiniQuestions = numMiniQuestions;
	
		if (numMiniQuestions > 0) {
			// Create an array of mini-question objects for the selected number of mini-questions
			const miniQuestions = Array(numMiniQuestions).fill().map(() => ({
				question: '',
				hint: '',
			}));
			
			// Update the miniQuestions property for the selected type
			types[typeIndex].miniQuestions = miniQuestions;
		} else {
			// If the selected number of mini-questions is 0, clear the miniQuestions array for the selected type
			types[typeIndex].miniQuestions = [];
		}
		
		setSubquestions(updatedSubquestions);
	};
	
	const handleMiniQuestionChange = (
		subquestionIndex,
		typeIndex,
		miniQuestionIndex,
		e,
	) => {
		const updatedSubquestions = [...subquestions];
		updatedSubquestions[subquestionIndex].types[typeIndex].miniQuestions[
			miniQuestionIndex
		] = {
			...updatedSubquestions[subquestionIndex].types[typeIndex]
				.miniQuestions[miniQuestionIndex],
			question: e.target.value,
		};
		setSubquestions(updatedSubquestions);
	};

	const handleHintChange = (
		subquestionIndex,
		typeIndex,
		miniQuestionIndex,
		e,
	) => {
		const updatedSubquestions = [...subquestions];
		updatedSubquestions[subquestionIndex].types[typeIndex].miniQuestions[
			miniQuestionIndex
		] = {
			...updatedSubquestions[subquestionIndex].types[typeIndex]
				.miniQuestions[miniQuestionIndex],
			hint: e.target.value,
		};
		setSubquestions(updatedSubquestions);
	};

	// Other state variables and functions...

	// Other state variables and functions...

	const baseUrl = 'http://localhost:5000/';

	const fetchFormData = async () => {
		try {
			const response = await fetch(
				`http://localhost:5000/question?questionId=${paramQuestionId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'token',
						)}`,
					},
				},
			);
			const data = await response.json();
			console.log(data);
			if (data.question) {
				const questionData = data.question;
				setMainQuestion(questionData.question);
				const imageSrc = questionData.image.startsWith('media/images/')
					? baseUrl + questionData.image
					: baseUrl + 'media/images/' + questionData.image;
				const pdfSrc = baseUrl + questionData.info;

				// Set the image and pdf URLs to state
				setSelectedImageURL(imageSrc);
				setPdf(pdfSrc);
				setQuestionId(paramQuestionId);

				// Set the image and pdf URLs by concatenating the media paths to the base URL
				// ...

				// Map the subquestions data to the state structure
				if (
					questionData.subQuestions &&
					questionData.subQuestions.length > 0
				) {
					const mappedSubQuestions = questionData.subQuestions.map(
						(subQuestion) => {
							// The subQuestions array is nested inside the SubQuestions property
							const subQuestionsData = subQuestion.SubQuestions;

							// Process each subquestion in the subQuestionsData array
							const types = subQuestionsData.map((type) => {
								// Extract the miniQuestions for each subquestion type
								const miniQuestions = type.subQuestions.map(
									(miniQuestion) => ({
										question: miniQuestion.question,
										hint: miniQuestion.hint,
									}),
								);

								return {
									label: type.tag,
									id: type._id,
									numMiniQuestions: miniQuestions.length,
									miniQuestions: miniQuestions,
								};
							});

							return {
								label: subQuestion.tag,
								question: subQuestion.question,
								types: types,
							};
						},
					);

					setSubquestions(mappedSubQuestions);
				}
			}
		} catch (error) {
			console.error('Error fetching form data:', error);
		}
	};

	useEffect(() => {
		// Fetch data from the teacher API and populate the form on mount
		fetchFormData();
	}, []);

	const handleSaveInfoCenter = () => {
		if (mainQuestion.trim() === '' || (image === null && pdf === null)) {
			setShowPopup(true);
		} else {
			const formData = new FormData();
			formData.append('questionText', mainQuestion);

			if (image) {
				formData.append('image', image);
				if (!imageURL.startsWith('media/images/')) {
					formData.append('imagePath', 'media/images/' + image.name);
				}
			} else {
				// If image is not selected, send the existing image path again
				formData.append('imagePath', imageURL);
			}

			if (pdf) {
				formData.append('info', pdf);
			} else {
				// If pdf is not selected, send the existing pdf path again
				formData.append('infoPath', pdfURL);
			}

			if (questionId) {
				// If questionId is present in the URL, edit the existing question
				fetch(
					`http://localhost:5000/question/edit/main?questionId=${questionId}`,
					{
						method: 'POST',
						body: formData,
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				)
					.then((response) => {
						if (response.ok) {
							console.log('Main question edited successfully!');
							// Handle success and any other logic here...
						} else {
							throw new Error('Error editing main question');
						}
					})
					.catch((error) => {
						console.error('Error editing main question:', error);
					});
				console.log(formData);
			} else {
				// If questionId is not present in the URL, create a new question
				fetch('http://localhost:5000/question/create/main', {
					method: 'POST',
					body: formData,
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'token',
						)}`,
					},
				})
					.then((response) => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error('Error saving main question');
						}
					})
					.then((data) => {
						const questionId = data.questionId;
						console.log('Main question saved successfully!');
						console.log('Question ID:', questionId);
						// Save the question ID in the state
						setQuestionId(questionId);

						// Redirect to the dynamic route with the question ID
						navigate(`/question/${questionId}`);

						// Perform any actions after successfully saving the main question
						// Now you can use the questionId to associate the subquestions with the main question

						// Call the function to save subquestions with the retrieved questionId
						// Pass the questionId here
					})
					.catch((error) => {
						console.error('Error saving main question:', error);
					});
			}
		}
	};

	const handleSave = (questionIndex) => {
		const subquestion = subquestions[questionIndex];

		const isSubquestionEmpty = subquestion.question.trim() === '';
		const isCalculationType = subquestion.label === 'Calculation';
		const hasMiniQuestions = isCalculationType
			? false
			: subquestion.types[0].miniQuestions.length > 0;

		if (!isSubquestionEmpty) {
			if (isCalculationType && !hasMiniQuestions) {
				// For "Calculation" type with no mini-questions
				const questionData = {
					questionId: questionId?.toString() || '',
					question: subquestion.question,
					type: subquestion.label.toLowerCase(),
				};

				console.log(
					'Data sent to backend for subquestion:',
					JSON.stringify(questionData),
				);

				fetch('http://localhost:5000/question/create/sub', {
					method: 'POST',
					body: JSON.stringify(questionData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem(
							'token',
						)}`,
					},
				})
					.then((response) => {
						if (response.ok) {
							console.log(
								`Subquestion ${
									questionIndex + 1
								} saved successfully!`,
							);
						} else {
							throw new Error(
								`Error saving subquestion ${questionIndex + 1}`,
							);
						}
					})
					.catch((error) => {
						console.error(
							`Error saving subquestion ${questionIndex + 1}:`,
							error,
						);
					});
			} else if (!isCalculationType || hasMiniQuestions) {
				// For other types or "Calculation" type with mini-questions
				const questionData = {
					questionId: questionId?.toString() || '',
					question: subquestion.question,
					type: subquestion.label.toLowerCase(),
					questions: subquestion.types.flatMap((type) => {
						const subtype = type.id.toLowerCase();
						return type.miniQuestions.map((miniQuestion) => ({
							subtype,
							subQuestions: [
								...type.miniQuestions.map((miniQ) => ({
									question: miniQ.question,
									hint: miniQ.hint,
								})),
							],
						}));
					}),
				};

				console.log(
					'Data sent to backend for subquestion:',
					JSON.stringify(questionData),
				);

				fetch('http://localhost:5000/question/create/sub', {
					method: 'POST',
					body: JSON.stringify(questionData),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem(
							'token',
						)}`,
					},
				})
					.then((response) => {
						if (response.ok) {
							console.log(
								`Subquestion ${
									questionIndex + 1
								} saved successfully!`,
							);
						} else {
							throw new Error(
								`Error saving subquestion ${questionIndex + 1}`,
							);
						}
					})
					.catch((error) => {
						console.error(
							`Error saving subquestion ${questionIndex + 1}:`,
							error,
						);
					});
			}
		} else {
			setShowPopup(true);
		}
	};
	const handleFinish = () => {
		if (
			mainQuestion.trim() === '' ||
			image === null ||
			pdf === null ||
			subquestions.some((subquestion) => {
				return (
					subquestion.question.trim() === '' ||
					(subquestion.types &&
						subquestion.types.length > 0 &&
						subquestion.types.some((type) => {
							return (
								type.miniQuestions &&
								type.miniQuestions.length > 0 &&
								type.miniQuestions.some(
									(miniQuestion) =>
										miniQuestion.question.trim() === '' ||
										miniQuestion.hint.trim() === '',
								)
							);
						}))
				);
			})
		) {
			setShowPopup(true);
		} else {
			console.log('Finish button clicked!');
			// Add your finish logic here...
		}
	};

	const handleNextQuestion = () => {
		if (
			mainQuestion.trim() === '' ||
			image === null ||
			pdf === null ||
			subquestions.some((subquestion) => {
				return (
					subquestion.question.trim() === '' ||
					(subquestion.types &&
						subquestion.types.length > 0 &&
						subquestion.types.some((type) => {
							return (
								type.miniQuestions &&
								type.miniQuestions.length > 0 &&
								type.miniQuestions.some(
									(miniQuestion) =>
										miniQuestion.question.trim() === '' ||
										miniQuestion.hint.trim() === '',
								)
							);
						}))
				);
			})
		) {
			setShowPopup(true);
		} else {
			console.log('Next Question button clicked!');
			// Add your next question logic here...
		}
	};

	return (
		<div className="make-questions">
			<div className="form-container">
				<h2 className="form-heading">QUESTION INPUT FORM</h2>
				<form className="form">
					<div className="form-group">
						<label htmlFor="main-question" className="form-label">
							Main Question:
						</label>
						<input
							className="form-input"
							type="text"
							id="main-question"
							value={mainQuestion}
							onChange={(e) => setMainQuestion(e.target.value)}
						/>
					</div>
					<div className="form-group image-container">
						<label htmlFor="image" className="form-label">
							Image:
						</label>
						<input
							className="form-input"
							type="file"
							id="image"
							accept="image/*"
							onChange={handleImageChange}
						/>
					</div>

					{/* Display the selected image */}
					{selectedImageURL && (
						<div className="selected-image-container">
							<span className="form-label">Selected Image:</span>
							<img
								className="selected-image"
								src={selectedImageURL}
								alt="Selected"
							/>
						</div>
					)}
					<div className="form-group pdf-container">
						<label htmlFor="pdf" className="form-label">
							PDF File (Info Centre):
						</label>
						<input
							className="form-input"
							type="file"
							id="pdf"
							accept="application/pdf"
							onChange={(e) => setPdf(e.target.files[0])}
						/>
					</div>
					<div className="form-group">
						<button
							type="button"
							className="save-button"
							style={{ backgroundColor: 'orange' }}
							onClick={handleSaveInfoCenter}
						>
							{questionId ? 'Edit' : 'Save'} Main question, Image,
							and Info centre.
						</button>
					</div>
					{subquestions.map((subquestion, subquestionIndex) => (
						<div className="subquestion" key={subquestionIndex}>
							<div className="form-group">
								<label className="subquestion-label">
									{subquestion.label}:
								</label>
								<input
									className="form-input"
									type="text"
									value={subquestion.question}
									onChange={(e) =>
										handleSubquestionChange(
											subquestionIndex,
											e,
										)
									}
								/>
							</div>
							{subquestion.types.map((type, typeIndex) => (
								<div className="form-group" key={typeIndex}>
									{type.label !== 'Calculation' && (
										<div className="dropdown-container">
											<label className="dropdown-label">
												{type.label}:
											</label>
											<select
												className="dropdown wide-dropdown"
												value={type.numMiniQuestions}
												onChange={(e) =>
													handleNumMiniQuestionsChange(
														subquestionIndex,
														typeIndex,
														e,
													)
												}
											>
												{[1, 2, 3, 4, 5].map((num) => (
													<option
														key={num}
														value={num}
													>
														{num}
													</option>
												))}
											</select>
										</div>
									)}
									{type.numMiniQuestions > 0 && (
										<div className="mini-questions-container">
											{type.miniQuestions.map(
												(
													miniQuestion,
													miniQuestionIndex,
												) => (
													<div
														className="form-group mini-question"
														key={miniQuestionIndex}
													>
														<label className="form-label">
															Mini-Question{' '}
															{miniQuestionIndex +
																1}
															:
														</label>
														<input
															className="form-input"
															type="text"
															value={
																miniQuestion.question
															}
															onChange={(e) =>
																handleMiniQuestionChange(
																	subquestionIndex,
																	typeIndex,
																	miniQuestionIndex,
																	e,
																)
															}
														/>
														<label className="form-label">
															Hint:
														</label>
														<input
															className="form-input fixed-height"
															value={
																miniQuestion.hint
															}
															onChange={(e) =>
																handleHintChange(
																	subquestionIndex,
																	typeIndex,
																	miniQuestionIndex,
																	e,
																)
															}
														/>
													</div>
												),
											)}
										</div>
									)}
								</div>
							))}
							<div className="form-group">
								<button
									type="button"
									className="save-button"
									onClick={() => handleSave(subquestionIndex)}
								>
									Save
								</button>
							</div>
						</div>
					))}
				</form>
				{showPopup && <Popup setShowPopup={setShowPopup} />}
				<div className="save-status">
					{saveStatus.map((status, index) => (
						<div
							className={`save-status-dot ${
								status ? 'saved' : 'unsaved'
							}`}
							key={index}
						></div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Form;

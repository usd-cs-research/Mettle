import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
	const [showPopup, setShowPopup] = useState(false);

	const handleMainQuestionChange = (e) => {
		setMainQuestion(e.target.value);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
	};

	const handlePdfChange = (e) => {
		const file = e.target.files[0];
		setPdf(file);
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

		if (numMiniQuestions > 0) {
			// Create an array of mini-question objects for the selected number of mini-questions
			const miniQuestions = Array(numMiniQuestions)
				.fill()
				.map(() => ({
					question: '',
					hint: '',
				}));

			// Update the miniQuestions property for the selected type only
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

	const handleSaveInfoCenter = () => {
		if (mainQuestion.trim() === '' || image === null || pdf === null) {
			setShowPopup(true);
		} else {
			const formData = new FormData();
			formData.append('questionText', mainQuestion);
			formData.append('image', image);
			formData.append('info', pdf);

			if (questionId) {
				// If questionId is present in the URL, edit existing question
				fetch(
					`http://localhost:5000/question/edit?questionId=${questionId}`,
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
						navigate(`/createquestion/${questionId}`);

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
							onChange={handleMainQuestionChange}
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
					<div className="form-group pdf-container">
						<label htmlFor="pdf" className="form-label">
							PDF File (Info Centre):
						</label>
						<input
							className="form-input"
							type="file"
							id="pdf"
							accept="application/pdf"
							onChange={handlePdfChange}
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
					<div className="form-group">
						<button
							type="button"
							className="next-question-input-button"
							onClick={handleNextQuestion}
						>
							Next Question
						</button>
						<button
							type="button"
							className="finished-button"
							onClick={handleFinish}
						>
							Finished
						</button>
					</div>
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

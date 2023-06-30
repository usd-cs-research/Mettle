import React, { useState } from 'react';
import './form.css';
import Popup from './popup';

const Form = () => {
	const [mainQuestion, setMainQuestion] = useState('');
	const [image, setImage] = useState(null);
	const [subquestions, setSubquestions] = useState([
		{ question: '', hint: '', numMiniQuestions: 0, miniQuestions: [] },
		{ question: '', hint: '', numMiniQuestions: 0, miniQuestions: [] },
		{ question: '', hint: '', numMiniQuestions: 0, miniQuestions: [] },
		{ question: '', hint: '', numMiniQuestions: 0, miniQuestions: [] },
		{ question: '', hint: '', numMiniQuestions: 0, miniQuestions: [] },
	]);
	const [saveStatus, setSaveStatus] = useState(
		Array(subquestions.length).fill(false),
	);
	const [showPopup, setShowPopup] = useState(false);

	const handleMainQuestionChange = (e) => {
		setMainQuestion(e.target.value);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
	};

	const handleSubquestionChange = (index, e) => {
		const updatedSubquestions = [...subquestions];
		updatedSubquestions[index].question = e.target.value;
		setSubquestions(updatedSubquestions);
	};

	const handleHintChange = (index, e) => {
		const updatedSubquestions = [...subquestions];
		updatedSubquestions[index].hint = e.target.value;
		setSubquestions(updatedSubquestions);
	};

	const handleNumMiniQuestionsChange = (index, e) => {
		const updatedSubquestions = [...subquestions];
		const numMiniQuestions = parseInt(e.target.value);
		updatedSubquestions[index].numMiniQuestions = numMiniQuestions;
		updatedSubquestions[index].miniQuestions =
			Array(numMiniQuestions).fill('');
		setSubquestions(updatedSubquestions);
	};

	const handleMiniQuestionChange = (
		subquestionIndex,
		miniQuestionIndex,
		e,
	) => {
		const updatedSubquestions = [...subquestions];
		updatedSubquestions[subquestionIndex].miniQuestions[miniQuestionIndex] =
			e.target.value;
		setSubquestions(updatedSubquestions);
	};

	const handleSave = (index) => {
		const subquestion = subquestions[index];
		const isSubquestionEmpty = subquestion.question === '';
		const isHintEmpty = subquestion.hint === '';
		const isMiniQuestionsEmpty = subquestion.miniQuestions.some(
			(question) => question === '',
		);

		if (
			mainQuestion.trim() === '' ||
			image === null ||
			isSubquestionEmpty ||
			isHintEmpty ||
			isMiniQuestionsEmpty
		) {
			setShowPopup(true);
		} else {
			setSaveStatus((prevStatus) => {
				const updatedStatus = [...prevStatus];
				updatedStatus[index] = true;
				return updatedStatus;
			});
		}
	};

	return (
		<div className="form-container">
			<h2 className="form-heading">NEW QUESTION INPUT FORM</h2>
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
				{subquestions.map((subquestion, index) => (
					<div className="subquestion" key={index}>
						<div className="form-group">
							<label
								htmlFor={`subquestion-${index}`}
								className="form-label"
							>
								Subquestion:
							</label>
							<input
								className="form-input"
								type="text"
								id={`subquestion-${index}`}
								value={subquestion.question}
								onChange={(e) =>
									handleSubquestionChange(index, e)
								}
							/>
						</div>
						<div className="form-group">
							<label
								htmlFor={`hint-${index}`}
								className="form-label"
							>
								Hint:
							</label>
							<input
								className="form-input"
								type="text"
								id={`hint-${index}`}
								value={subquestion.hint}
								onChange={(e) => handleHintChange(index, e)}
							/>
						</div>
						<div className="form-group">
							<label
								htmlFor={`num-mini-questions-${index}`}
								className="form-label"
							>
								Number of Mini Questions:
							</label>
							<input
								className="form-input"
								type="number"
								id={`num-mini-questions-${index}`}
								value={subquestion.numMiniQuestions}
								onChange={(e) =>
									handleNumMiniQuestionsChange(index, e)
								}
							/>
						</div>
						<div className="form-miniquestions">
							{subquestion.miniQuestions.map(
								(question, miniQuestionIndex) => (
									<div
										className="form-miniquestion"
										key={miniQuestionIndex}
									>
										<label
											htmlFor={`mini-question-${index}-${miniQuestionIndex}`}
											className="form-miniquestion-label"
										>
											Mini Question{' '}
											{miniQuestionIndex + 1}:
										</label>
										<input
											className="form-miniquestion-input"
											type="text"
											id={`mini-question-${index}-${miniQuestionIndex}`}
											value={question}
											onChange={(e) =>
												handleMiniQuestionChange(
													index,
													miniQuestionIndex,
													e,
												)
											}
										/>
									</div>
								),
							)}
							<button
								className="save-button"
								onClick={() => handleSave(index)}
							>
								{saveStatus[index] ? 'Saved' : 'Save'}
							</button>
						</div>
					</div>
				))}
			</form>
			{showPopup && <Popup closePopup={() => setShowPopup(false)} />}
		</div>
	);
};

export default Form;

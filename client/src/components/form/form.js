import React, { useState } from 'react';
import './form.css';
import Popup from './popup';
import LogoutButton from '../global/logoutButton';

const Form = () => {
	const [mainQuestion, setMainQuestion] = useState('');
	const [image, setImage] = useState(null);
	const [subquestions, setSubquestions] = useState([
		{ question: '', numMiniQuestions: 0, miniQuestions: [] },
		{ question: '', numMiniQuestions: 0, miniQuestions: [] },
		{ question: '', numMiniQuestions: 0, miniQuestions: [] },
		{ question: '', numMiniQuestions: 0, miniQuestions: [] },
		{ question: '', numMiniQuestions: 0, miniQuestions: [] },
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
		const isMiniQuestionsEmpty = subquestion.miniQuestions.some(
			(question) => question === '',
		);

		if (
			mainQuestion.trim() === '' ||
			image === null ||
			isSubquestionEmpty ||
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
		<>
			<div className="form-container">
				<h2 className="form-heading">Add/Edit Question</h2>
				<form className="form">
					<div className="form-group">
						<label htmlFor="main-question">Main Question:</label>
						<input
							className="form-input"
							type="text"
							id="main-question"
							value={mainQuestion}
							onChange={handleMainQuestionChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="image">Image:</label>
						<input
							className="form-input"
							type="file"
							id="image"
							onChange={handleImageChange}
						/>
					</div>
					{subquestions.map((subquestion, index) => (
						<div className="subquestion" key={index}>
							<div className="form-group">
								<label htmlFor={`subquestion-${index}`}>
									Subquestion {index + 1}:
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
								<label htmlFor={`num-miniquestions-${index}`}>
									Number of Mini Questions:
								</label>
								<select
									className="form-input"
									id={`num-miniquestions-${index}`}
									value={subquestion.numMiniQuestions}
									onChange={(e) =>
										handleNumMiniQuestionsChange(index, e)
									}
								>
									<option value="0">Select</option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
								</select>
							</div>
							{subquestion.numMiniQuestions > 0 && (
								<div>
									{Array.from(
										Array(subquestion.numMiniQuestions),
										(_, miniQuestionIndex) => (
											<div
												className="form-group"
												key={miniQuestionIndex}
											>
												<label
													htmlFor={`miniquestion-${index}-${miniQuestionIndex}`}
												>
													Mini Question{' '}
													{miniQuestionIndex + 1}:
												</label>
												<input
													className="form-input"
													type="text"
													id={`miniquestion-${index}-${miniQuestionIndex}`}
													value={
														subquestion
															.miniQuestions[
															miniQuestionIndex
														]
													}
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
								</div>
							)}
							<button
								className="save-button"
								type="button"
								onClick={() => handleSave(index)}
								disabled={saveStatus[index]}
							>
								Save
							</button>
							{saveStatus[index] && (
								<span className="save-status">Saved!</span>
							)}
						</div>
					))}
				</form>
				{showPopup && <Popup onClose={() => setShowPopup(false)} />}
			</div>
			<LogoutButton />
		</>
	);
};

export default Form;

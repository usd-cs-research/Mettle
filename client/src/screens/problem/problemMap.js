import React, { useEffect, useState } from 'react';
import ProblemHeader from '../../components/problem/problemHeader';
import DynamicDiagramComponent from '../../components/problem/diagramComponent';
import MyMenu from '../../components/problem/myMenu';
import { useLocation } from 'react-router-dom';

export default function ProblemMapScreen() {
	const apiurl = process.env.REACT_APP_API_URL;
	const [questionData, setQuestionData] = useState({});
	const sessionId = useLocation().pathname.replace('/problem', '');
	const [subquestionData, setSubquestionData] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(
					`${apiurl}/session/status?sessionId=${localStorage.getItem(
						'sessionId',
					)}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				);
				const data = await res.json();
				localStorage.setItem('questionId', data.session.questionId);
				const response = await fetch(
					`${apiurl}/question/main?questionId=${data.session.questionId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'token',
							)}`,
						},
					},
				);
				const data2 = await response.json();
				setQuestionData(data2);
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (questionData.question) {
			const mappedData = {};
			questionData.question.subQuestions.forEach((subQuestion) => {
				mappedData[subQuestion.tag] = subQuestion.question;
			});
			setSubquestionData(mappedData);
		}
	}, [questionData]);

	return (
		<>
			<ProblemHeader />
			<div className="info">
				<p className="col-lg-8 problem-info">
					Here's a map of this sub-problem. Click on any of the
					sub-goals to begin solving the problem.
				</p>
				<MyMenu
					question={
						questionData.question?.question || 'Loading Question'
					}
				/>
			</div>
			{questionData.question && (
				<DynamicDiagramComponent
					functional={
						subquestionData.functional || 'Loading Question'
					}
					qualitative={
						subquestionData.qualitative || 'Loading Question'
					}
					quantitative={
						subquestionData.quantitative || 'Loading Question'
					}
					calculation={
						subquestionData.calculation || 'Loading Question'
					}
					evaluation={
						subquestionData.evaluation || 'Loading Question'
					}
					sessionId={sessionId.replace('/', '')}
				/>
			)}
		</>
	);
}

import React from 'react';
import Header from '../../components/global/header';
import './selectproblemscreen.css';
import TeacherSelectProblemMainSection from '../../components/selectProblem/teacherMainSection';

export default function TeacherSelectProblemScreen() {
	return (
		<>
			<Header />
			<TeacherSelectProblemMainSection />
		</>
	);
}

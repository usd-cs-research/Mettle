import React from 'react';
import './selectproblemscreen.css';
import TeacherSelectProblemMainSection from '../../components/selectProblem/teacherMainSection';
import IndexHeader from '../index/indexheader3.jsx';

export default function TeacherSelectProblemScreen() {
	return (
		<>
			<IndexHeader />
			<TeacherSelectProblemMainSection />
		</>
	);
}

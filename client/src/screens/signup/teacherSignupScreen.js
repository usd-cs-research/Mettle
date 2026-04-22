import React from 'react';
import './signupscreen.css';
import SignupMainSection from '../../components/signup/mainSection';
import IndexHeader from '../index/indexheader.jsx';

export default function TeacherSignupScreen() {
	return (
		<>
			<IndexHeader />
			<SignupMainSection type="teacher" />
		</>
	);
}

import React from 'react';
import './signupscreen.css';
import Header from '../../components/global/header';
import LoginTop from '../../components/login/loginTopSection';
import SignupMainSection from '../../components/signup/mainSection';

export default function TeacherSignupScreen() {
	return (
		<>
			<Header />
			<LoginTop />
			<SignupMainSection type="teacher" />
		</>
	);
}

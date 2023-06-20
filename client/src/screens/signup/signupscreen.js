import React from 'react';
import './signupscreen.css';
import Header from '../../components/global/header';
import LoginTop from '../../components/login/logintopsec';
import SignupMainSection from '../../components/signup/mainsection';

export default function SignupScreen() {
	return (
		<>
			<Header />
			<LoginTop />
			<SignupMainSection />
		</>
	);
}

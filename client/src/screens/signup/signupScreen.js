import React from 'react';
import './signupscreen.css';
import Header from '../../components/global/header';
import LoginTop from '../../components/login/loginTopSection';
import SignupMainSection from '../../components/signup/mainSection';
import IndexHeader from '../index/indexheader.jsx';
export default function SignupScreen() {
	return (
		<>
			<IndexHeader />
			<SignupMainSection type="student" />
		</>
	);
}

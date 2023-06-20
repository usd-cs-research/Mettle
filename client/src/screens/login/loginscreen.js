import React from 'react';
import Header from '../../components/global/header';
import LoginTop from '../../components/login/logintopsec';
import LoginMainSection from '../../components/login/mainsection';
import './loginscreen.css';

export default function LoginScreen() {
	return (
		<>
			<Header />
			<LoginTop />
			<LoginMainSection />
		</>
	);
}

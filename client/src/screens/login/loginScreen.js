import React from 'react';
import IndexHeader from '../index/indexheader.jsx';
import Header from '../../components/global/header';
import LoginTop from '../../components/login/loginTopSection';
import LoginMainSection from '../../components/login/mainSection';
import './loginscreen.css';

export default function LoginScreen() {
	return (
		<>
			<IndexHeader />
			<LoginMainSection />
		</>
	);
}

import React from 'react';
import './introscreen.css';
import Header from '../../components/global/header';
import IndexHeader from '../index/indexheader3.jsx';
import IntroScreenMainSection from '../../components/intro/mainSection';

export default function IntroScreen() {
	return (
		<>
		
			<IndexHeader />
			<IntroScreenMainSection />
		</>
	);
}

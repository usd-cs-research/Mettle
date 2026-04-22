import React from 'react';
import './sessionscreen.css';
import Header from '../../components/global/header';
import SessionMainSection from '../../components/session/mainSection';
import IndexHeader from '../index/indexheader2.jsx';
export default function SessionScreen() {
	return (
		<>
			<IndexHeader />
			<SessionMainSection />
		</>
	);
}

import React from 'react';
import './sessionscreen.css';
import Header from '../../components/global/header';
import SessionMainSection from '../../components/session/mainSection';
import GeminiChat from '../../components/session/GeminiChat';

export default function SessionScreen() {
	const sessionId = localStorage.getItem('sessionId');
	const userId = localStorage.getItem('userId');

	return (
		<>
			<Header />
			<SessionMainSection />
			{sessionId && userId && <GeminiChat sessionId={sessionId} userId={userId} />}
		</>
	);
}

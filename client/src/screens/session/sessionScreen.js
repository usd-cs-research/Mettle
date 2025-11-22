import React from 'react';
import './sessionscreen.css';
import Header from '../../components/global/header';
import SessionMainSection from '../../components/session/mainSection';
import useActionLogger from '../../hooks/useActionLogger';
import loggerService from '../../services/loggerService';

export default function SessionScreen() {
	// Add logging for student actions
	const logger = useActionLogger('SessionScreen');
	
	return (
		<>
			<Header />
			<SessionMainSection />
		</>
	);
}

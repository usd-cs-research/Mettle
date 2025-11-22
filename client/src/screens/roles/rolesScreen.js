import React from 'react';
import Header from '../../components/global/header';
import RolesMainSection from '../../components/roles/mainSection';
import useActionLogger from '../../hooks/useActionLogger';
import './rolesscreen.css';

export default function RolesScreen() {
	// Add logging for student actions
	const logger = useActionLogger('RolesScreen');
	
	return (
		<>
			<Header />
			<RolesMainSection />
		</>
	);
}

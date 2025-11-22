import React from 'react';
import Header from '../../components/global/headerWithIcon';
import DetailsMainSection from '../../components/details/mainSection';
import useActionLogger from '../../hooks/useActionLogger';
import './detailsscreen.css';

export default function DetailsScreen() {
	// Add logging for student actions
	const logger = useActionLogger('DetailsScreen');
	
	return (
		<>
			<Header />
			<DetailsMainSection />
		</>
	);
}

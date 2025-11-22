import React from 'react';
import Header from '../../components/global/headerWithIcon';
import SelectProblemMainSection from '../../components/selectProblem/mainSection';
import useActionLogger from '../../hooks/useActionLogger';
import './selectproblemscreen.css';

export default function SelectProblemScreen() {
	// Add logging for student actions
	const logger = useActionLogger('SelectProblemScreen');
	
	return (
		<>
			<Header />
			<SelectProblemMainSection />
		</>
	);
}

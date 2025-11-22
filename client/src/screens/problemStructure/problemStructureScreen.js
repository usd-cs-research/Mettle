import React from 'react';
import './problemstructurescreen.css';
import Header from '../../components/global/headerWithIcon';
import ProblemStructureMainSection from '../../components/problemStructure/mainSection';
import useActionLogger from '../../hooks/useActionLogger';

export default function ProblemStructureScreen() {
	// Add logging for student actions
	const logger = useActionLogger('ProblemStructureScreen');
	
	return (
		<>
			<Header />
			<ProblemStructureMainSection />
		</>
	);
}

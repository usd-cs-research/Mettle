import React from 'react';
import Header from '../../components/global/header';
import RolesMainSection from '../../components/roles/mainSection';
import './rolesscreen.css';
import IndexHeader from '../index/indexheader3.jsx';

export default function RolesScreen() {
	return (
		<>
		<div>
			<IndexHeader />
			<div>
			<RolesMainSection />
		</div>
		</div>
		</>
	);
}

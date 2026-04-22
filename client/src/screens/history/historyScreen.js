import React from 'react';
import './historyscreen.css';
import Header from '../../components/global/header';
import HistoryMainSection from '../../components/history/mainSection';
import IndexHeader from '../index/indexheader3.jsx';
export default function HistoryScreen() {
	return (
		<>
			<IndexHeader />
			<HistoryMainSection />
		</>
	);
}

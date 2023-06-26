import './App.css';

import { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authContext } from './services/authContext';

import IndexScreen from './screens/index/indexScreen';
import LoginScreen from './screens/login/loginScreen';
import SignupScreen from './screens/signup/signupScreen';
import IntroScreen from './screens/intro/introScreen';
import SessionScreen from './screens/session/sessionScreen';
import RolesScreen from './screens/roles/rolesScreen';
import HistoryScreen from './screens/history/historyScreen';
import ProblemStructureScreen from './screens/problemStructure/problemStructureScreen';
import DetailsScreen from './screens/details/detailsScreen';
import SelectProblemScreen from './screens/selectProblem/selectProblemScreen';

function App() {
	const {
		isAuthenticated,
		type,
		login,
		newToken,
		setType,
		setRole,
		setUserId,
	} = useContext(authContext);

	const LStoken = localStorage.getItem('token');
	const LStype = localStorage.getItem('type');
	const LSrole = localStorage.getItem('role');
	const LSuserId = localStorage.getItem('userId');

	useEffect(() => {
		if (LStoken && LStype && LSrole && LSuserId) {
			newToken(LStoken);
			setType(LStype);
			setRole(LSrole);
			setUserId(LSuserId);
			login();
		}
	}, [
		LStoken,
		LStype,
		newToken,
		setType,
		login,
		setRole,
		setUserId,
		LSuserId,
		LSrole,
	]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<IndexScreen />} />
				<Route path="/login" element={<LoginScreen />} />
				<Route path="/register" element={<SignupScreen />} />
				<Route path="/intro" element={<IntroScreen />} />
				<Route path="/session" element={<SessionScreen />} />
				<Route path="/roles" element={<RolesScreen />} />
				<Route path="/history" element={<HistoryScreen />} />
				<Route path="/structure" element={<ProblemStructureScreen />} />
				<Route path="/details" element={<DetailsScreen />} />
				<Route
					path="/selectproblem"
					element={<SelectProblemScreen />}
				/>
				<Route path="/*" element={<Navigate to={'/'} />} />
			</Routes>
		</BrowserRouter>
	);
}
export default App;

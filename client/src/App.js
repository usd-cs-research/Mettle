import './App.css';

import { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import TeacherSignupScreen from './screens/signup/teacherSignupScreen';
import TeacherSelectProblemScreen from './screens/selectProblem/teacherSelectProblemScreen';
import FormScreen from './screens/form/formscreen';
import SocketTestScreen from './screens/socketTest/socketTestScreen';
import ProblemMapScreen from './screens/problem/problemMap';
import ScribblePadScreen from './screens/problem/scribblePad';

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
		if (LStoken && LStype && LSuserId) {
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
		<Routes>
			{!isAuthenticated && (
				<>
					<Route path="/" element={<IndexScreen />} />
					<Route path="/login" element={<LoginScreen />} />
					<Route path="/register" element={<SignupScreen />} />
					<Route
						path="/teacherregister"
						element={<TeacherSignupScreen />}
					/>
					<Route path="/*" element={<Navigate to={'/'} />} />
				</>
			)}
			{isAuthenticated && type === 'student' && (
				<>
					<Route path="/intro" element={<IntroScreen />} />
					<Route path="/session" element={<SessionScreen />} />
					<Route path="/:sessionId/roles" element={<RolesScreen />} />
					<Route path="/history" element={<HistoryScreen />} />
					<Route
						path="/:sessionId/structure"
						element={<ProblemStructureScreen />}
					/>
					<Route
						path="/:sessionId/details"
						element={<DetailsScreen />}
					/>
					<Route
						path="/:sessionId/selectproblem"
						element={<SelectProblemScreen />}
					/>
					<Route
						path="/:sessionId/test"
						element={<SocketTestScreen />}
					/>
					<Route
						path="/:sessionId/problem/"
						element={<ProblemMapScreen />}
					/>
					<Route
						path="/:sessionId/problem/notes"
						element={<ScribblePadScreen />}
					/>
					<Route path="/*" element={<Navigate to={'/intro'} />} />
				</>
			)}
			{isAuthenticated && type === 'teacher' && (
				<>
					<Route path="/intro" element={<IntroScreen />} />
					<Route
						path="/teacherquestions"
						element={<TeacherSelectProblemScreen />}
					/>
					<Route path="/createquestion" element={<FormScreen />} />
					<Route path="/*" element={<Navigate to={'/intro'} />} />
				</>
			)}

			<Route path="/*" element={<Navigate to={'/'} />} />
		</Routes>
	);
}
export default App;

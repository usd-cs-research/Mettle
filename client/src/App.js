import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndexScreen from './screens/index/indexScreen';
import LoginScreen from './screens/login/loginScreen';
import SignupScreen from './screens/signup/signupScreen';
import IntroScreen from './screens/intro/introScreen';
import SessionScreen from './screens/session/sessionScreen';
import RolesScreen from './screens/roles/rolesScreen';
import HistoryScreen from './screens/history/historyScreen';
import ProblemStructureScreen from './screens/problemStructure/problemStructureScreen';
import DetailsScreen from './screens/details/detailsScreen';

function App() {
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
			</Routes>
		</BrowserRouter>
	);
}
export default App;

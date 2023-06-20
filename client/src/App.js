import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndexScreen from './screens/index/indexScreen';
import LoginScreen from './screens/login/loginScreen';
import SignupScreen from './screens/signup/signupScreen';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<IndexScreen />}>
					<Route path="login" element={<LoginScreen />} />
					<Route path="register" element={<SignupScreen />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

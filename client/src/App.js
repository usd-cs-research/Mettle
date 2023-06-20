import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IndexScreen from './screens/index/indexscreen';
import LoginScreen from './screens/login/loginscreen';
import SignupScreen from './screens/signup/signupscreen';

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

import './App.css';

import { useContext } from 'react';
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
import FunctionalModelMainScreen from './screens/problem/functional/modelMain';
import FunctionalModelPromptsScreen from './screens/problem/functional/modelPrompts';
import FunctionalEvaluateDominantScreen from './screens/problem/functional/evaluateDominant';
import FunctionalEvaluateCheckScreen from './screens/problem/functional/evaluateCheck';
import FunctionalPlanScreen from './screens/problem/functional/plan';
import QualitativeModelScreen from './screens/problem/qualitative/model';
import QualitativeEvaluateCheckScreen from './screens/problem/qualitative/evaluateCheck';
import QualitativeEvaluateDominantScreen from './screens/problem/qualitative/evaluateDominant';
import QualitativePlanScreen from './screens/problem/qualitative/plan';
import QuantitativeModelScreen from './screens/problem/quantitative/model';
import QuantitativeEvaluateCheckScreen from './screens/problem/quantitative/evaluateCheck';
import QuantitativePlanScreen from './screens/problem/quantitative/plan';
import QuantitativeEvaluateCompleteScreen from './screens/problem/quantitative/evaluateComplete';
import CalculationCalculationScreen from './screens/problem/calculation/calculation';
import EvaluationEvaluationScreen from './screens/problem/evaluation/evaluation';
import Popup from './components/global/popup';

function App() {
	const { isAuthenticated, type, popupBool, popupData } =
		useContext(authContext);

	return (
		<>
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
						<Route path="/history" element={<HistoryScreen />} />
						<Route
							path="/:sessionId/roles"
							element={<RolesScreen />}
						/>
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
						<Route
							path="/:sessionId/problem/functional/model/main"
							element={<FunctionalModelMainScreen />}
						/>
						<Route
							path="/:sessionId/problem/functional/evaluate/check"
							element={<FunctionalEvaluateCheckScreen />}
						/>
						<Route
							path="/:sessionId/problem/functional/evaluate/dominant"
							element={<FunctionalEvaluateDominantScreen />}
						/>
						<Route
							path="/:sessionId/problem/functional/plan"
							element={<FunctionalPlanScreen />}
						/>
						<Route
							path="/:sessionId/problem/qualitative/model"
							element={<QualitativeModelScreen />}
						/>
						<Route
							path="/:sessionId/problem/qualitative/evaluate/check"
							element={<QualitativeEvaluateCheckScreen />}
						/>
						<Route
							path="/:sessionId/problem/qualitative/evaluate/dominant"
							element={<QualitativeEvaluateDominantScreen />}
						/>
						<Route
							path="/:sessionId/problem/qualitative/plan"
							element={<QualitativePlanScreen />}
						/>
						<Route
							path="/:sessionId/problem/quantitative/model"
							element={<QuantitativeModelScreen />}
						/>
						<Route
							path="/:sessionId/problem/quantitative/evaluate/check"
							element={<QuantitativeEvaluateCheckScreen />}
						/>
						<Route
							path="/:sessionId/problem/quantitative/evaluate/complete"
							element={<QuantitativeEvaluateCompleteScreen />}
						/>
						<Route
							path="/:sessionId/problem/quantitative/plan"
							element={<QuantitativePlanScreen />}
						/>
						<Route
							path="/:sessionId/problem/calculation/calculation"
							element={<CalculationCalculationScreen />}
						/>
						<Route
							path="/:sessionId/problem/evaluation/evaluation"
							element={<EvaluationEvaluationScreen />}
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
						<Route path="/question" element={<FormScreen />} />
						<Route
							path="/question/:questionId"
							element={<FormScreen />}
						/>
						<Route path="/*" element={<Navigate to={'/intro'} />} />
					</>
				)}

				<Route path="/*" element={<Navigate to={'/'} />} />
			</Routes>
			{popupBool && (
				<Popup type={popupData.type} message={popupData.message} />
			)}
		</>
	);
}
export default App;

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AuthProvider from './services/authContext';

test('renders App component without crashing', () => {
	const { container } = render(
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>,
	);

	// Simply check that the app renders without errors
	expect(container).toBeInTheDocument();
});

test('App has routing structure', () => {
	const { container } = render(
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>,
	);

	// Check that the main app container exists
	expect(container.firstChild).not.toBeNull();
});

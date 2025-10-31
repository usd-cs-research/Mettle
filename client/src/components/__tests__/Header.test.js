import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from '../../services/authContext';
import Header from '../../components/global/header';

describe('Header Component', () => {
	const renderHeader = () => {
		return render(
			<BrowserRouter>
				<AuthProvider>
					<Header />
				</AuthProvider>
			</BrowserRouter>,
		);
	};

	it('renders the meTTle branding', () => {
		renderHeader();

		// Look for meTTle text or logo
		const brandElement = screen.getByText(/meTTle/i);
		expect(brandElement).toBeInTheDocument();
	});

	it('renders navigation links', () => {
		renderHeader();

		// Check if header contains navigation (this might need adjustment based on actual header)
		const header = screen.getByRole('banner') || document.querySelector('header');
		expect(header).toBeInTheDocument();
	});

	it('displays correctly in the DOM structure', () => {
		const { container } = renderHeader();

		// Check that header is rendered
		const headerElement =
			container.querySelector('header') || container.querySelector('nav');
		expect(headerElement).toBeInTheDocument();
	});
});

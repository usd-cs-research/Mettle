import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RolesMainSection from '../mainSection';
import { authContext } from '../../../services/authContext';
import { sessionSocket } from '../../../services/socket';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('../../../services/socket', () => ({
  sessionSocket: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
}));
jest.mock('../../global/logoutButton', () => {
  return function MockLogoutButton() {
    return <button>Logout</button>;
  };
});

const mockNavigate = jest.fn();
const mockValidSession = jest.fn();
const mockShowPopup = jest.fn();

const mockAuthContextValue = {
  validSession: mockValidSession,
  showPopup: mockShowPopup,
};

describe('RolesMainSection Component', () => {
  // Save original fetch to restore later
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    const { useNavigate, useLocation } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({
      pathname: '/roles/test-session-id',
    });

    // Set up localStorage
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('userId', 'user123');

    // Set up global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    localStorage.clear();
    // Restore original fetch instead of deleting
    global.fetch = originalFetch;
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <authContext.Provider value={mockAuthContextValue}>
          <RolesMainSection />
        </authContext.Provider>
      </BrowserRouter>
    );
  };

  describe('Component Rendering', () => {
    test('should render role descriptions correctly', () => {
      renderComponent();

      expect(screen.getByText('Two Different Roles')).toBeInTheDocument();
      expect(screen.getByText('Driver')).toBeInTheDocument();
      expect(screen.getByText('Navigator')).toBeInTheDocument();
      expect(screen.getByText(/The driver is the one that can interact/)).toBeInTheDocument();
      expect(screen.getByText(/The navigator is the one that will help/)).toBeInTheDocument();
    });

    test('should render continue button', () => {
      renderComponent();

      const continueButton = screen.getByText('Continue');
      expect(continueButton).toBeInTheDocument();
      expect(continueButton).toHaveClass('default--button');
    });

    test('should render logout button', () => {
      renderComponent();

      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('should display role images', () => {
      renderComponent();

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('alt', 'driver');
      expect(images[1]).toHaveAttribute('alt', 'navigator');
    });
  });

  describe('Continue Handler - Session with Question', () => {
    test('should navigate to problem page when session has questionId', async () => {
      const mockResponse = {
        status: 'online',
        session: {
          sessionID: 'session123',
          userOne: {
            userId: 'user123',
            userRole: 'driver',
          },
          userTwo: {
            userId: 'user456',
            userRole: 'navigator',
          },
          questionId: 'question789',
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      renderComponent();

      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(mockValidSession).toHaveBeenCalledWith('session123', 'driver');
      });

      expect(localStorage.getItem('sessionId')).toBe('session123');
      expect(localStorage.getItem('role')).toBe('driver');
      expect(localStorage.getItem('questionId')).toBe('question789');
      expect(mockNavigate).toHaveBeenCalledWith('/test-session-id/problem');
    });

    test('should handle userTwo correctly', async () => {
      localStorage.setItem('userId', 'user456');

      const mockResponse = {
        status: 'online',
        session: {
          sessionID: 'session123',
          userOne: {
            userId: 'user123',
            userRole: 'driver',
          },
          userTwo: {
            userId: 'user456',
            userRole: 'navigator',
          },
          questionId: 'question789',
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      renderComponent();

      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(mockValidSession).toHaveBeenCalledWith('session123', 'navigator');
      });

      expect(localStorage.getItem('role')).toBe('navigator');
    });
  });

  describe('Continue Handler - Session without Question', () => {
    test('should navigate to structure page when no questionId', async () => {
      const mockResponse = {
        status: 'online',
        session: {
          sessionID: 'session123',
          userOne: {
            userId: 'user123',
            userRole: 'driver',
          },
          userTwo: {
            userId: 'user456',
            userRole: 'navigator',
          },
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      renderComponent();

      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/test-session-id/structure');
      });
    });
  });

  describe('Error Handling', () => {
    test('should show popup when session is offline', async () => {
      const mockResponse = {
        status: 'offline',
        session: {
          sessionID: 'session123',
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      renderComponent();

      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(mockShowPopup).toHaveBeenCalled();
      });

      const popupCall = mockShowPopup.mock.calls[0];
      expect(popupCall[0]).toContain('offline');
      expect(popupCall[1]).toBe('red');
    });

    test('should handle fetch failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Not found' }),
      });

      renderComponent();

      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(mockShowPopup).toHaveBeenCalled();
      });

      const popupCall = mockShowPopup.mock.calls[0];
      expect(popupCall[0]).toContain('Failed to fetch data');
      expect(popupCall[1]).toBe('red');
    });

    test('should handle network error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      renderComponent();

      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(mockShowPopup).toHaveBeenCalled();
      });

      const popupCall = mockShowPopup.mock.calls[0];
      expect(popupCall[0]).toContain('Network error');
    });
  });

  describe('Socket Event Handling', () => {
    test('should emit forward event when continue button is clicked', async () => {
      const mockResponse = {
        status: 'online',
        session: {
          sessionID: 'session123',
          userOne: {
            userId: 'user123',
            userRole: 'driver',
          },
          userTwo: {
            userId: 'user456',
            userRole: 'navigator',
          },
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      renderComponent();

      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(sessionSocket.emit).toHaveBeenCalled();
      });

      expect(sessionSocket.emit).toHaveBeenCalledWith('forward', {
        eventDesc: 'roles--continue',
        sessionId: 'test-session-id',
      });
    });

    test('should listen for forward socket events', () => {
      renderComponent();

      expect(sessionSocket.on).toHaveBeenCalledWith('forward', expect.any(Function));
    });

    test('should trigger continue function when receiving forward event', async () => {
      const mockResponse = {
        status: 'online',
        session: {
          sessionID: 'session123',
          userOne: {
            userId: 'user123',
            userRole: 'driver',
          },
          userTwo: {
            userId: 'user456',
            userRole: 'navigator',
          },
        },
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      renderComponent();

      // Get the forward event handler
      const forwardHandler = sessionSocket.on.mock.calls.find((call) => call[0] === 'forward');
      expect(forwardHandler).toBeDefined();

      const handler = forwardHandler[1];

      // Simulate receiving forward event
      handler({ eventDesc: 'roles--continue' });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Session ID Parsing', () => {
    test('should correctly parse session ID from pathname', async () => {
      const mockResponse = {
        status: 'online',
        session: {
          sessionID: 'session123',
          userOne: {
            userId: 'user123',
            userRole: 'driver',
          },
          userTwo: {
            userId: 'user456',
            userRole: 'navigator',
          },
        },
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      renderComponent();

      const continueButton = screen.getByText('Continue');
      fireEvent.click(continueButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const fetchUrl = global.fetch.mock.calls[0][0];
      expect(fetchUrl).toContain('sessionId=test-session-id');
    });
  });
});

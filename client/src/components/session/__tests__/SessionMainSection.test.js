/* eslint-disable testing-library/no-unnecessary-act */
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from '../../../services/authContext';
import SessionMainSection from '../mainSection';
import { sessionSocket } from '../../../services/socket';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the socket
jest.mock('../../../services/socket', () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
  return {
    sessionSocket: mockSocket,
  };
});

jest.mock('../../global/logoutButton', () => {
  return function MockLogoutButton() {
    return <button>Logout</button>;
  };
});

describe('Session Management - Create & Join Flow', () => {
  const renderSessionScreen = () => {
    // Set up mock user in localStorage
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('userId', 'mock-user-id-123');

    return render(
      <BrowserRouter>
        <AuthProvider>
          <SessionMainSection />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  const typeIntoInput = async (input, value) => {
    await act(async () => {
      await userEvent.clear(input);
      await userEvent.type(input, value);
    });
  };

  const clickElement = async (element) => {
    await act(async () => {
      await userEvent.click(element);
    });
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Component Rendering', () => {
    it('renders session input and action buttons', () => {
      renderSessionScreen();

      // Check for session input
      const input = screen.getByPlaceholderText(/enter the group you want to create/i);
      expect(input).toBeInTheDocument();

      // Check for Join and Create buttons
      const joinButton = screen.getByRole('button', {
        name: /join session/i,
      });
      const createButton = screen.getByRole('button', {
        name: /create session/i,
      });

      expect(joinButton).toBeInTheDocument();
      expect(createButton).toBeInTheDocument();
    });

    it('renders logout button and previous problems link', () => {
      renderSessionScreen();

      // Check for logout button
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();

      // Check for previous problems button
      const prevButton = screen.getByRole('button', {
        name: /previously solved problems/i,
      });
      expect(prevButton).toBeInTheDocument();
    });

    it('allows user to type session name', async () => {
      renderSessionScreen();

      const input = screen.getByPlaceholderText(/enter the group you want to create/i);

      await typeIntoInput(input, 'Test Session');
      expect(input).toHaveValue('Test Session');
    });
  });

  describe('Create Session Flow', () => {
    it('successfully creates a new session', async () => {
      renderSessionScreen();

      const input = screen.getByPlaceholderText(/enter the group you want to create/i);
      const createButton = screen.getByRole('button', {
        name: /create session/i,
      });

      // Fill in session name
      await typeIntoInput(input, 'My New Session');

      // Click create
      await clickElement(createButton);

      // Wait for API call and navigation
      await waitFor(() => {
        // Verify socket was connected
        expect(sessionSocket.connect).toHaveBeenCalled();
      });

      // Verify socket emit was called with correct data
      expect(sessionSocket.emit).toHaveBeenCalledWith('join', {
        sessionId: 'mock-session-id-abc123',
        userId: 'mock-user-id-123',
      });

      // Verify navigation to roles screen
      expect(mockNavigate).toHaveBeenCalledWith('/mock-session-id-abc123/roles');
    });

    it('handles create session API error', async () => {
      // Save the original fetch
      const originalFetch = global.fetch;

      // Mock fetch to return error
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: async () => ({
            message: 'Session name already exists',
          }),
        })
      );

      renderSessionScreen();

      const input = screen.getByPlaceholderText(/enter the group you want to create/i);
      const createButton = screen.getByRole('button', {
        name: /create session/i,
      });

      await typeIntoInput(input, 'Duplicate Session');
      await clickElement(createButton);

      // Wait for error handling
      await waitFor(() => {
        // Should not navigate on error
        expect(mockNavigate).not.toHaveBeenCalled();
      });

      // Restore original fetch
      global.fetch = originalFetch;
    });

    it('stores sessionId in localStorage after creation', async () => {
      renderSessionScreen();

      const input = screen.getByPlaceholderText(/enter the group you want to create/i);
      const createButton = screen.getByRole('button', {
        name: /create session/i,
      });

      await typeIntoInput(input, 'Test Session');
      await clickElement(createButton);

      // Wait for socket connection which happens right before localStorage is set
      await waitFor(() => {
        expect(sessionSocket.connect).toHaveBeenCalled();
      });

      // Verify localStorage was set correctly
      const sessionId = localStorage.getItem('sessionId');
      expect(sessionId).toBe('mock-session-id-abc123');

      // Verify navigation happened
      expect(mockNavigate).toHaveBeenCalledWith('/mock-session-id-abc123/roles');
    });
  });

  describe('Join Session Flow', () => {
    it('successfully joins an existing session', async () => {
      // Mock successful session status check
      global.fetch = jest.fn((url) => {
        if (url.includes('/session/status')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              sessionDetails: {
                _id: 'existing-session-id',
                sessionName: 'Existing Session',
              },
            }),
          });
        }
        return Promise.reject('Unknown URL');
      });

      renderSessionScreen();

      const input = screen.getByPlaceholderText(/enter the group you want to create/i);
      const joinButton = screen.getByRole('button', {
        name: /join session/i,
      });

      await typeIntoInput(input, 'Existing Session');
      await clickElement(joinButton);

      await waitFor(() => {
        // Verify socket connection
        expect(sessionSocket.connect).toHaveBeenCalled();
      });

      // Verify socket emit with session name (for join flow)
      expect(sessionSocket.emit).toHaveBeenCalledWith('join', {
        sessionName: 'Existing Session',
        userId: 'mock-user-id-123',
      });

      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledWith('/existing-session-id/roles');
    });

    it('handles join session when session does not exist', async () => {
      // Mock session not found
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({
            sessionDetails: null,
          }),
        })
      );

      renderSessionScreen();

      const input = screen.getByPlaceholderText(/enter the group you want to create/i);
      const joinButton = screen.getByRole('button', {
        name: /join session/i,
      });

      await typeIntoInput(input, 'Nonexistent Session');
      await clickElement(joinButton);

      await waitFor(() => {
        // Should not navigate
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    it('handles join session API failure', async () => {
      // Mock API error
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        })
      );

      renderSessionScreen();

      const input = screen.getByPlaceholderText(/enter the group you want to create/i);
      const joinButton = screen.getByRole('button', {
        name: /join session/i,
      });

      await typeIntoInput(input, 'Any Session');
      await clickElement(joinButton);

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  describe('Socket Event Handling', () => {
    it('registers socket event listeners on mount', async () => {
      renderSessionScreen();

      await waitFor(() =>
        expect(sessionSocket.on).toHaveBeenCalledWith('connect', expect.any(Function))
      );

      expect(sessionSocket.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
      expect(sessionSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
      expect(sessionSocket.on).toHaveBeenCalledWith('joined', expect.any(Function));
    });

    it('cleans up socket event listeners on unmount', async () => {
      const { unmount } = renderSessionScreen();

      await waitFor(() =>
        expect(sessionSocket.on).toHaveBeenCalledWith('connect', expect.any(Function))
      );

      const handlerMap = new Map(sessionSocket.on.mock.calls);

      unmount();

      expect(sessionSocket.off).toHaveBeenCalledWith('connect', handlerMap.get('connect'));
      expect(sessionSocket.off).toHaveBeenCalledWith(
        'connect_error',
        handlerMap.get('connect_error')
      );
      expect(sessionSocket.off).toHaveBeenCalledWith('disconnect', handlerMap.get('disconnect'));
      expect(sessionSocket.off).toHaveBeenCalledWith('joined', handlerMap.get('joined'));
    });

    it('handles socket connect event', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      renderSessionScreen();

      // Find the connect event handler
      const connectCall = sessionSocket.on.mock.calls.find((call) => call[0] === 'connect');

      // Verify handler exists
      expect(connectCall).toBeDefined();

      // Trigger the connect handler
      const connectHandler = connectCall[1];
      connectHandler();

      // Verify console log
      expect(consoleSpy).toHaveBeenCalledWith('Socket Connected');

      consoleSpy.mockRestore();
    });

    it('handles socket disconnect event', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      renderSessionScreen();

      // Find the disconnect event handler
      const disconnectCall = sessionSocket.on.mock.calls.find((call) => call[0] === 'disconnect');

      // Verify handler exists
      expect(disconnectCall).toBeDefined();

      // Trigger the disconnect handler
      const disconnectHandler = disconnectCall[1];
      disconnectHandler();

      expect(consoleSpy).toHaveBeenCalledWith('Session socket disconnected');

      consoleSpy.mockRestore();
    });

    it('handles connect_error event', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderSessionScreen();

      // Find the connect_error event handler
      const errorCall = sessionSocket.on.mock.calls.find((call) => call[0] === 'connect_error');

      // Verify handler exists
      expect(errorCall).toBeDefined();

      // Trigger the error handler
      const errorHandler = errorCall[1];
      const mockError = new Error('Connection failed');
      errorHandler(mockError);

      expect(consoleSpy).toHaveBeenCalledWith('Session socket connection error:', mockError);

      consoleSpy.mockRestore();
    });
  });

  describe('Navigation', () => {
    it('navigates to history page when clicking previous problems', async () => {
      renderSessionScreen();

      const prevButton = screen.getByRole('button', {
        name: /previously solved problems/i,
      });

      await clickElement(prevButton);

      expect(mockNavigate).toHaveBeenCalledWith('/history');
    });
  });
});

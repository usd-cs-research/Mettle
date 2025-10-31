import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProblemHeader from '../problemHeader';
import { authContext } from '../../../services/authContext';
import { sessionSocket } from '../../../services/socket';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../../services/socket', () => {
  const mockSocket = {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
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

const mockNavigate = jest.fn();
const mockSwitchRole = jest.fn();

const mockAuthContextValue = {
  switchRole: mockSwitchRole,
};

describe('ProblemHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { useNavigate, useParams } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({
      sessionId: 'test-session-123',
    });

    // Set up localStorage
    localStorage.setItem('role', 'Driver');
    localStorage.setItem('questionId', 'question123');
    localStorage.setItem('sessionId', 'test-session-123');
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <authContext.Provider value={mockAuthContextValue}>
          <ProblemHeader />
        </authContext.Provider>
      </BrowserRouter>
    );
  };

  describe('Component Rendering', () => {
    test('should render role indicator for Driver', () => {
      renderComponent();

      const roleImage = screen.getByAltText('Role');
      expect(roleImage).toBeInTheDocument();
      expect(roleImage).toHaveAttribute('title', expect.stringContaining('Driver'));
    });

    test('should render role indicator for Navigator', () => {
      localStorage.setItem('role', 'Navigator');

      renderComponent();

      const roleImage = screen.getByAltText('Role');
      expect(roleImage).toHaveAttribute('title', expect.stringContaining('Navigator'));
    });

    test('should render MEttLE header', () => {
      renderComponent();

      expect(screen.getByText('MEttLE')).toBeInTheDocument();
    });

    test('should render logout button', () => {
      renderComponent();

      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('Role Switching', () => {
    test('should emit role-switch event when changeRole is triggered', () => {
      renderComponent();

      // The component has role switching logic
      // Verify role-switch listener is registered
      const roleSwitchHandler = sessionSocket.on.mock.calls.find(
        (call) => call[0] === 'role-switch'
      );

      expect(roleSwitchHandler).toBeDefined();
    });

    test('should switch from Driver to Navigator', () => {
      localStorage.setItem('role', 'Driver');

      renderComponent();

      // Get the role-switch handler
      const roleSwitchHandler = sessionSocket.on.mock.calls.find(
        (call) => call[0] === 'role-switch'
      )[1];

      // Trigger the handler
      roleSwitchHandler();

      expect(mockSwitchRole).toHaveBeenCalledWith('Navigator');
    });

    test('should switch from Navigator to Driver', () => {
      localStorage.setItem('role', 'Navigator');

      renderComponent();

      // Get the role-switch handler
      const roleSwitchHandler = sessionSocket.on.mock.calls.find(
        (call) => call[0] === 'role-switch'
      )[1];

      // Trigger the handler
      roleSwitchHandler();

      expect(mockSwitchRole).toHaveBeenCalledWith('Driver');
    });
  });

  describe('Session Exit', () => {
    test('should handle session-offline event', () => {
      renderComponent();

      // Get the session-offline handler
      const offlineHandler = sessionSocket.on.mock.calls.find(
        (call) => call[0] === 'session-offline'
      );

      expect(offlineHandler).toBeDefined();

      const handler = offlineHandler[1];
      handler();

      expect(sessionSocket.emit).toHaveBeenCalledWith('exit-session');
      expect(sessionSocket.disconnect).toHaveBeenCalled();
      expect(localStorage.getItem('questionId')).toBeNull();
      expect(localStorage.getItem('sessionId')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/intro');
    });

    test('should clean up localStorage on exit', () => {
      renderComponent();

      const offlineHandler = sessionSocket.on.mock.calls.find(
        (call) => call[0] === 'session-offline'
      )[1];

      // Verify items exist before
      expect(localStorage.getItem('questionId')).toBeTruthy();
      expect(localStorage.getItem('sessionId')).toBeTruthy();
      expect(localStorage.getItem('role')).toBeTruthy();

      offlineHandler();

      // Verify items removed after
      expect(localStorage.getItem('questionId')).toBeNull();
      expect(localStorage.getItem('sessionId')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
    });
  });

  describe('Navigation Events', () => {
    test('should listen for forward event to navigate to notepad', () => {
      renderComponent();

      const forwardHandlers = sessionSocket.on.mock.calls.filter((call) => call[0] === 'forward');

      expect(forwardHandlers.length).toBeGreaterThan(0);

      // Test notepad navigation
      forwardHandlers.forEach(([, handler]) => {
        handler({ eventDesc: 'problem-redirect-notepad' });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/test-session-123/problem/notes');
    });

    test('should navigate to problem map on forward event', () => {
      renderComponent();

      const forwardHandlers = sessionSocket.on.mock.calls.filter((call) => call[0] === 'forward');

      // Test problem map navigation
      forwardHandlers.forEach(([, handler]) => {
        handler({ eventDesc: 'problem-redirect-problemmap' });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/test-session-123/problem/aboutproblem');
    });

    test('should navigate to info centre on forward event', () => {
      renderComponent();

      const forwardHandlers = sessionSocket.on.mock.calls.filter((call) => call[0] === 'forward');

      forwardHandlers.forEach(([, handler]) => {
        handler({ eventDesc: 'problem-redirect-infocentre' });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/test-session-123/problem/infocentre');
    });

    test('should navigate to problem page on forward event', () => {
      renderComponent();

      const forwardHandlers = sessionSocket.on.mock.calls.filter((call) => call[0] === 'forward');

      forwardHandlers.forEach(([, handler]) => {
        handler({ eventDesc: 'problem-redirect-problem' });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/test-session-123/problem');
    });

    test('should emit forward event when clicking MEttLE header', () => {
      renderComponent();

      const mettleHeader = screen.getByText('MEttLE');
      fireEvent.click(mettleHeader);

      expect(sessionSocket.emit).toHaveBeenCalledWith('forward', {
        sessionId: 'test-session-123',
        eventDesc: 'problem-redirect-problem',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/test-session-123/problem');
    });
  });

  describe('Socket Event Listeners', () => {
    test('should set up all required socket listeners', () => {
      renderComponent();

      const eventTypes = sessionSocket.on.mock.calls.map((call) => call[0]);

      expect(eventTypes).toContain('session-offline');
      expect(eventTypes).toContain('role-switch');
      expect(eventTypes.filter((e) => e === 'forward').length).toBeGreaterThan(0);
    });

    test('should handle multiple forward events correctly', () => {
      renderComponent();

      const forwardHandlers = sessionSocket.on.mock.calls.filter((call) => call[0] === 'forward');

      // Should have multiple forward handlers for different redirects
      expect(forwardHandlers.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Session ID Integration', () => {
    test('should use session ID from params', () => {
      const { useParams } = require('react-router-dom');
      useParams.mockReturnValue({
        sessionId: 'my-custom-session',
      });

      renderComponent();

      const mettleHeader = screen.getByText('MEttLE');
      fireEvent.click(mettleHeader);

      expect(sessionSocket.emit).toHaveBeenCalledWith('forward', {
        sessionId: 'my-custom-session',
        eventDesc: 'problem-redirect-problem',
      });
    });

    test('should navigate with correct session ID', () => {
      renderComponent();

      const forwardHandlers = sessionSocket.on.mock.calls.filter((call) => call[0] === 'forward');

      forwardHandlers[0][1]({ eventDesc: 'problem-redirect-notepad' });

      const navigateCall = mockNavigate.mock.calls.find(
        (call) => call[0] && call[0].includes('notes')
      );
      expect(navigateCall[0]).toContain('test-session-123');
    });
  });

  describe('Role Display', () => {
    test('should show correct tooltip for Driver role', () => {
      localStorage.setItem('role', 'Driver');

      renderComponent();

      const roleImage = screen.getByAltText('Role');
      const title = roleImage.getAttribute('title');

      expect(title).toContain('Driver');
      expect(title).toContain('interacts with the page');
    });

    test('should show correct tooltip for Navigator role', () => {
      localStorage.setItem('role', 'Navigator');

      renderComponent();

      const roleImage = screen.getByAltText('Role');
      const title = roleImage.getAttribute('title');

      expect(title).toContain('Navigator');
      expect(title).toContain('discuss with the driver');
    });

    test('should use correct image for Driver role', () => {
      localStorage.setItem('role', 'Driver');

      renderComponent();

      const roleImage = screen.getByAltText('Role');
      expect(roleImage.src).toContain('steering-wheel');
    });

    test('should use correct image for Navigator role', () => {
      localStorage.setItem('role', 'Navigator');

      renderComponent();

      const roleImage = screen.getByAltText('Role');
      expect(roleImage.src).toContain('navigator-compass');
    });
  });

  describe('Event Order and Timing', () => {
    test('should set up event listeners immediately on mount', () => {
      renderComponent();

      // Event listeners should be registered
      expect(sessionSocket.on).toHaveBeenCalled();
    });

    test('should handle rapid forward events', () => {
      renderComponent();

      const forwardHandlers = sessionSocket.on.mock.calls.filter((call) => call[0] === 'forward');

      // Trigger multiple events rapidly
      forwardHandlers.forEach(([, handler]) => {
        handler({ eventDesc: 'problem-redirect-notepad' });
        handler({ eventDesc: 'problem-redirect-problemmap' });
        handler({ eventDesc: 'problem-redirect-infocentre' });
      });

      // All navigation calls should be made
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});

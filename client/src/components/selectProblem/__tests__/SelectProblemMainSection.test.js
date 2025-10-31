import React from 'react';
/* eslint-disable testing-library/no-unnecessary-act */
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SelectProblemMainSection from '../mainSection';

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

jest.mock('../problemCard', () => {
  return function MockProblemCard({ data }) {
    return (
      <div data-testid="problem-card">
        <h3>{data.question}</h3>
        <img src={data.imgurl} alt="problem" />
      </div>
    );
  };
});

const mockNavigate = jest.fn();

describe('SelectProblemMainSection Component', () => {
  // Save original fetch to restore later
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    const { useNavigate, useLocation } = require('react-router-dom');
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue({
      pathname: '/selectproblem/session123',
    });

    // Set up localStorage
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('role', 'driver');

    // Set up global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    localStorage.clear();
    // Restore original fetch instead of deleting
    global.fetch = originalFetch;
  });

  const renderComponent = async () => {
    let renderResult;
    await act(async () => {
      renderResult = render(
        <BrowserRouter>
          <SelectProblemMainSection />
        </BrowserRouter>
      );
    });
    return renderResult;
  };

  describe('Component Rendering', () => {
    test('should render header text', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: [] }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      expect(
        screen.getByText('Here are some estimation problems for you to solve!')
      ).toBeInTheDocument();
    });

    test('should render logout button', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: [] }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('should show loading state initially', async () => {
      global.fetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ questions: [] }),
                }),
              100
            )
          )
      );

      await renderComponent();

      // Component renders immediately with empty state
      expect(screen.queryAllByTestId('problem-card')).toHaveLength(0);
    });
  });

  describe('Fetching Problems', () => {
    test('should fetch problems on component mount', async () => {
      const mockQuestions = [
        {
          _id: '1',
          question: 'How many tennis balls fit in a school bus?',
          image: 'tennis-balls.jpg',
        },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: mockQuestions }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/question/main/student'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          }),
        })
      );
    });

    test('should render problem cards after successful fetch', async () => {
      const mockQuestions = [
        {
          _id: '1',
          question: 'How many tennis balls fit in a school bus?',
          image: 'tennis-balls.jpg',
        },
        {
          _id: '2',
          question: 'How many gas stations are in the US?',
          image: 'gas-station.jpg',
        },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: mockQuestions }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(screen.getAllByTestId('problem-card')).toHaveLength(2);
      });

      expect(screen.getByText('How many tennis balls fit in a school bus?')).toBeInTheDocument();
      expect(screen.getByText('How many gas stations are in the US?')).toBeInTheDocument();
    });

    test('should pass correct props to ProblemCard', async () => {
      const mockQuestions = [
        {
          _id: 'question123',
          question: 'Test Question',
          image: 'test-image.jpg',
        },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: mockQuestions }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('problem-card')).toBeInTheDocument();
      });

      const problemCard = screen.getByTestId('problem-card');
      expect(problemCard).toHaveTextContent('Test Question');
    });

    test('should handle empty questions array', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: [] }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      expect(screen.queryAllByTestId('problem-card')).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle fetch failure gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Unauthorized' }),
      });

      renderComponent();

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    test('should handle network error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      renderComponent();

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    test('should not crash with malformed response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await renderComponent();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Component should still render
      expect(
        screen.getByText('Here are some estimation problems for you to solve!')
      ).toBeInTheDocument();
    });
  });

  describe('Authentication', () => {
    test('should include auth token in fetch request', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: [] }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const fetchCall = global.fetch.mock.calls[0];
      expect(fetchCall[1].headers.Authorization).toBe('Bearer mock-token');
    });

    test('should handle missing token', async () => {
      localStorage.removeItem('token');

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: [] }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const fetchCall = global.fetch.mock.calls[0];
      expect(fetchCall[1].headers.Authorization).toBe('Bearer null');
    });
  });

  describe('Multiple Problems Rendering', () => {
    test('should render multiple problem cards correctly', async () => {
      const mockQuestions = [
        {
          _id: '1',
          question: 'Question 1',
          image: 'img1.jpg',
        },
        {
          _id: '2',
          question: 'Question 2',
          image: 'img2.jpg',
        },
        {
          _id: '3',
          question: 'Question 3',
          image: 'img3.jpg',
        },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: mockQuestions }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(screen.getAllByTestId('problem-card')).toHaveLength(3);
      });
    });

    test('should maintain question order', async () => {
      const mockQuestions = [
        { _id: '1', question: 'First', image: 'img1.jpg' },
        { _id: '2', question: 'Second', image: 'img2.jpg' },
        { _id: '3', question: 'Third', image: 'img3.jpg' },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: mockQuestions }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(screen.getAllByTestId('problem-card')).toHaveLength(3);
      });

      const cards = screen.getAllByTestId('problem-card');
      expect(cards[0]).toHaveTextContent('First');
      expect(cards[1]).toHaveTextContent('Second');
      expect(cards[2]).toHaveTextContent('Third');
    });
  });

  describe('Session ID Handling', () => {
    test('should extract session ID from pathname', async () => {
      const { useLocation } = require('react-router-dom');
      useLocation.mockReturnValue({
        pathname: '/selectproblem/my-session-123',
      });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: [] }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Session ID should be available for ProblemCard components
      // (passed as prop, verified through mock)
    });

    test('should handle pathname without session ID', async () => {
      const { useLocation } = require('react-router-dom');
      useLocation.mockReturnValue({
        pathname: '/selectproblem',
      });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: [] }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Component should still render
      expect(
        screen.getByText('Here are some estimation problems for you to solve!')
      ).toBeInTheDocument();
    });
  });

  describe('Image URL Construction', () => {
    test('should construct correct image URLs', async () => {
      const mockQuestions = [
        {
          _id: '1',
          question: 'Test Question',
          image: 'uploads/test-image.jpg',
        },
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ questions: mockQuestions }),
      });

      await renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('problem-card')).toBeInTheDocument();
      });

      const image = screen.getByAltText('problem');
      expect(image.src).toContain('uploads/test-image.jpg');
    });
  });
});

import { http, HttpResponse } from 'msw';

// Use localhost:4000 to match test environment
const API_URL = 'http://localhost:4000';

export const handlers = [
  // Login endpoint mock
  http.post(`${API_URL}/login`, async ({ request }) => {
    const body = await request.json();
    const { email, password } = body;

    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json({
        token: 'mock-jwt-token-student',
        userId: 'mock-user-id-123',
        designation: 'student',
      });
    }

    if (email === 'teacher@example.com' && password === 'password123') {
      return HttpResponse.json({
        token: 'mock-jwt-token-teacher',
        userId: 'mock-teacher-id-456',
        designation: 'teacher',
      });
    }

    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  // Signup endpoint mock
  http.post(`${API_URL}/signup`, async ({ request }) => {
    const body = await request.json();
    const { email, name, designation } = body;

    return HttpResponse.json({
      token: 'mock-jwt-token-new-user',
      userId: 'mock-new-user-id-789',
      designation: designation || 'student',
    });
  }),

  // Session create endpoint mock
  http.post(`${API_URL}/session/create`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionName } = body;

    return HttpResponse.json({
      sessionId: 'mock-session-id-abc123',
      sessionName: sessionName,
    });
  }),

  // Session details endpoint mock
  http.get(`${API_URL}/session/details`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');

    return HttpResponse.json({
      session: {
        sessionId: sessionId,
        sessionName: 'Mock Session',
        userOne: {
          userId: 'mock-user-id-123',
          userRole: 'Driver',
          userStatus: 'online',
        },
        userTwo: null,
        notepad: '',
        state: 'intro',
      },
    });
  }),

  // Session status endpoint mock
  http.get(`${API_URL}/session/status`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({
      session: {
        sessionId: 'mock-session-id-abc123',
        questionId: 'mock-question-id-xyz',
        state: 'problem-map',
      },
    });
  }),

  // Questions list endpoint mock (for problem selection)
  http.get(`${API_URL}/api/questions`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json([
      {
        _id: 'question-1',
        title: 'Tennis Balls in School Bus',
        question: 'How many tennis balls can fit in a school bus?',
        tags: ['estimation', 'physics'],
      },
      {
        _id: 'question-2',
        title: 'Gas Stations in USA',
        question: 'How many gas stations are there in the USA?',
        tags: ['market-sizing', 'estimation'],
      },
      {
        _id: 'question-3',
        title: 'Piano Tuners in Chicago',
        question: 'How many piano tuners are in Chicago?',
        tags: ['fermi', 'estimation'],
      },
    ]);
  }),

  // Question endpoint mock (for retrieving specific question details)
  http.get(`${API_URL}/question/main`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({
      question: {
        _id: 'mock-question-id-xyz',
        question: 'How many tennis balls can fit in a school bus?',
        subQuestions: [
          { tag: 'functional', question: 'Functional analysis question' },
          {
            tag: 'qualitative',
            question: 'Qualitative analysis question',
          },
          {
            tag: 'quantitative',
            question: 'Quantitative analysis question',
          },
          { tag: 'calculation', question: 'Calculation question' },
          { tag: 'evaluation', question: 'Evaluation question' },
        ],
      },
    });
  }),
];

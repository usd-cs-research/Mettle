import { sessionActivities } from '../sockets/session';

// Minimal fake Socket object to capture emits/joins
function makeFakeSocket(): any {
  const rooms = new Set<string>();
  const s: any = {
    id: 'socket-1',
    rooms,
    join(room: string) {
      rooms.add(room);
    },
    in(room: string) {
      return {
        emit: (event: string, payload: any) => {
          // For test: record emitted values
          s._lastEmit = { room, event, payload };
        },
      };
    },
    emit(event: string, payload: any) {
      s._lastEmit = { room: null, event, payload };
    },
    on: jest.fn(),
    _lastEmit: null as any,
  };
  // Socket.IO automatically adds the socket's own ID to rooms
  rooms.add(s.id);
  return s;
}

// Mock the models module used by session.ts
jest.mock('../models/sessionDetailsSchema', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    updateOne: jest.fn(),
  },
}));

jest.mock('../models/sessionSchema', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

import sessionDetailsModels from '../models/sessionDetailsSchema';
import sessionModel from '../models/sessionSchema';

describe('sessionActivities socket handlers (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('join: should join room and emit joined to room', async () => {
    const fakeSocket = makeFakeSocket();

    // sessionModel.findOne used to map sessionName -> id
    (sessionModel.findOne as jest.Mock).mockResolvedValue({ _id: 'sess-1' });

    // sessionDetailsModels.findOne returns an existing session doc with userOne set
    (sessionDetailsModels.findOne as jest.Mock).mockResolvedValue({
      sessionID: 'sess-1',
      userOne: { userId: 'user-1', userStatus: 'offline' },
      userTwo: undefined,
    });

    // Attach handlers
    sessionActivities(fakeSocket as unknown as any);

    // Trigger join event handler - sessionActivities registers socket.on('join', ...)
    // Find the registered handler from fakeSocket.on calls
    const calls = (fakeSocket.on as jest.Mock).mock.calls;
    const joinCall = calls.find((c) => c[0] === 'join');
    expect(joinCall).toBeDefined();
    const joinHandler = joinCall[1];

    // Call handler with event payload
    await joinHandler({ sessionName: 'someName', userId: 'user-1' });

    // Ensure socket joined and emitted
    expect(fakeSocket._lastEmit).not.toBeNull();
    expect(fakeSocket._lastEmit.event).toBe('joined');
    expect(fakeSocket._lastEmit.payload).toMatchObject({ userId: 'user-1' });
  });

  test('forward: emits to partner in same room', async () => {
    const fakeSocket = makeFakeSocket();
    // Add the session room to simulate socket.join() having been called
    fakeSocket.rooms.add('sess-2');

    sessionActivities(fakeSocket as unknown as any);
    const forwardCall = (fakeSocket.on as jest.Mock).mock.calls.find((c) => c[0] === 'forward');
    expect(forwardCall).toBeDefined();
    const forwardHandler = forwardCall[1];

    // Call forward handler
    await forwardHandler({ sessionId: 'sess-2', userId: 'user-2', data: { x: 1 } });

    // Should have emitted forward to room
    expect(fakeSocket._lastEmit).not.toBeNull();
    // event is 'forward'
    expect(fakeSocket._lastEmit.event).toBe('forward');
  });
});

/**
 * Socket.IO Mock for Testing
 * Provides a mock implementation of socket.io-client for Jest tests
 */

class MockSocket {
  constructor() {
    this.events = {};
    this.connected = false;
    this.id = 'mock-socket-id-' + Date.now();
  }

  // Register event listener
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this;
  }

  // Register one-time event listener
  once(event, callback) {
    const wrappedCallback = (...args) => {
      callback(...args);
      this.off(event, wrappedCallback);
    };
    return this.on(event, wrappedCallback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
    return this;
  }

  // Emit event (client -> server)
  emit(event, data) {
    console.log(`[Socket Mock] Emitting: ${event}`, data);
    // Optionally trigger mock server responses
    this._handleEmit(event, data);
    return this;
  }

  // Connect socket
  connect() {
    this.connected = true;
    setTimeout(() => {
      this._trigger('connect');
    }, 0);
    return this;
  }

  // Disconnect socket
  disconnect() {
    this.connected = false;
    setTimeout(() => {
      this._trigger('disconnect');
    }, 0);
    return this;
  }

  // Close socket (alias for disconnect)
  close() {
    return this.disconnect();
  }

  // Internal: Trigger event handlers (server -> client)
  _trigger(event, ...args) {
    console.log(`[Socket Mock] Received: ${event}`, args);
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback(...args);
      });
    }
  }

  // Internal: Handle client emits and trigger mock responses
  _handleEmit(event, data) {
    // Mock server responses
    if (event === 'join') {
      // Simulate successful join after 100ms
      setTimeout(() => {
        this._trigger('joined', {
          sessionId: data.sessionId || 'mock-session-id',
          userId: data.userId,
          message: 'Successfully joined session',
        });
      }, 100);
    }
  }

  // Manually trigger an event from tests
  // This simulates the server sending an event to the client
  mockEmit(event, data) {
    this._trigger(event, data);
  }
}

// Create a singleton instance
const mockSocketInstance = new MockSocket();

// Mock io function that returns the singleton
const mockIo = () => {
  return mockSocketInstance;
};

// Export both the function and the instance
module.exports = mockIo;
module.exports.mockSocket = mockSocketInstance;
module.exports.MockSocket = MockSocket;

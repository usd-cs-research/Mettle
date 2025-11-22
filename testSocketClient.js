const io = require('socket.io-client');

// Connect to the server (assuming running on localhost:5000)
const socket = io('http://localhost:5000/session', {
  extraHeaders: {
    // Add auth if needed, but for test, assume no
  }
});

socket.on('connect', () => {
  console.log('Connected to server');

  // Test gemini-query
  socket.emit('gemini-query', {
    sessionId: 'session-001', // Use the mock session
    userId: 'user1',
    query: 'How do I solve this problem?'
  });
});

socket.on('gemini-response', (data) => {
  console.log('Received gemini-response:', data);
});

socket.on('gemini-error', (data) => {
  console.log('Received gemini-error:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
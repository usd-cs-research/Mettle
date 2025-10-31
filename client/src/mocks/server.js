// Polyfills for MSW in Jest/Node environment
if (typeof global.TextEncoder === 'undefined') {
	const { TextEncoder, TextDecoder } = require('util');
	global.TextEncoder = TextEncoder;
	global.TextDecoder = TextDecoder;
}

if (typeof global.TransformStream === 'undefined') {
	const streams = require('web-streams-polyfill');
	global.TransformStream = streams.TransformStream;
}

if (typeof global.BroadcastChannel === 'undefined') {
	// Simple BroadcastChannel polyfill for Jest
	global.BroadcastChannel = class BroadcastChannel {
		constructor(name) {
			this.name = name;
		}
		postMessage() {}
		close() {}
		addEventListener() {}
		removeEventListener() {}
	};
}

// Use require() instead of import to ensure polyfills are applied first
const { setupServer } = require('msw/node');
const { handlers } = require('./handlers');

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);

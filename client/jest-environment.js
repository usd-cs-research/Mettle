// Custom Jest environment to add TextEncoder/TextDecoder globals
// Required for MSW (Mock Service Worker) to work in Jest/Node environment

const JSDOMEnvironment = require('jest-environment-jsdom').default;
const { TextEncoder, TextDecoder } = require('util');

class CustomJestEnvironment extends JSDOMEnvironment {
	async setup() {
		await super.setup();
		
		// Add TextEncoder and TextDecoder to the global scope
		this.global.TextEncoder = TextEncoder;
		this.global.TextDecoder = TextDecoder;
	}
}

module.exports = CustomJestEnvironment;

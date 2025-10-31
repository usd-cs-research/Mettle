// Polyfill for TextEncoder/TextDecoder (required by MSW in Jest/Node environment)
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

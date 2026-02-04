import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Polyfills for jsdom environment
if (typeof global !== 'undefined' && typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Polyfills for jsdom environment
if (typeof globalThis !== 'undefined' && typeof globalThis.TextEncoder === 'undefined') {
  // Simple polyfill for TextEncoder/TextDecoder in test environment
  (globalThis as any).TextEncoder = class TextEncoder {
    encode(input: string = ''): Uint8Array {
      const encoder = new Array(input.length);
      for (let i = 0; i < input.length; i++) {
        encoder[i] = input.charCodeAt(i);
      }
      return new Uint8Array(encoder);
    }
  };
  
  (globalThis as any).TextDecoder = class TextDecoder {
    decode(input: Uint8Array): string {
      return String.fromCharCode(...Array.from(input));
    }
  };
}
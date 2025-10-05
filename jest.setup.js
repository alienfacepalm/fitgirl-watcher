// Minimal chrome API mock for tests
global.chrome = {
  runtime: {
    onMessage: { addListener: jest.fn() },
    sendMessage: jest.fn(),
  },
  storage: {
    local: {
      get: jest.fn((keys, cb) => cb ? cb({}) : Promise.resolve({})),
      set: jest.fn((data, cb) => cb ? cb() : Promise.resolve()),
      remove: jest.fn((keys, cb) => cb ? cb() : Promise.resolve()),
      clear: jest.fn((cb) => cb ? cb() : Promise.resolve()),
    },
  },
  tabs: {
    query: jest.fn(() => Promise.resolve([])),
  },
};

// Basic DOM conveniences
document.body.innerHTML = '';


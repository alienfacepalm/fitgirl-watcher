const { WatchlistManager } = require('../src/background.js');

function createChromeMocks() {
  const storageData = {};
  return {
    storage: {
      local: {
        get: jest.fn(async (keys) => {
          if (keys === null) return { ...storageData };
          if (Array.isArray(keys)) {
            const out = {};
            keys.forEach((k) => (out[k] = storageData[k]));
            return out;
          }
          return { ...storageData };
        }),
        set: jest.fn(async (obj) => Object.assign(storageData, obj)),
        remove: jest.fn(async (keys) => {
          (Array.isArray(keys) ? keys : [keys]).forEach((k) => delete storageData[k]);
        }),
      },
    },
    runtime: {
      onMessage: { addListener: jest.fn() },
      getURL: jest.fn((p) => `chrome-extension://id/${p}`),
    },
    tabs: { create: jest.fn() },
    alarms: {
      getAll: jest.fn(async () => []),
      clear: jest.fn(),
      create: jest.fn(),
      onAlarm: { addListener: jest.fn() },
    },
    notifications: { create: jest.fn() },
  };
}

describe('WatchlistManager', () => {
  let chrome;
  beforeEach(() => {
    jest.useFakeTimers();
    chrome = (global.chrome = createChromeMocks());
  });

  afterEach(() => {
    jest.useRealTimers();
    delete global.chrome;
  });

  test('adds and removes items from watchlist', async () => {
    const mgr = new WatchlistManager();
    await mgr.initializeStorage();

    const item = await mgr.addToWatchlist({ id: 'game1', title: 'Game 1', url: 'https://example.com' });
    expect(item.id).toBe('game1');

    const items = await mgr.getWatchlistItems();
    expect(items.some((i) => i.id === 'game1')).toBe(true);

    await mgr.removeFromWatchlist('game1');
    const itemsAfter = await mgr.getWatchlistItems();
    expect(itemsAfter.some((i) => i.id === 'game1')).toBe(false);
  });

  test('calculateReminderDate respects days offset', () => {
    const mgr = new WatchlistManager();
    const now = new Date('2024-01-01T00:00:00.000Z');
    jest.setSystemTime(now);
    const iso = mgr.calculateReminderDate(7);
    expect(new Date(iso).toISOString()).toBe('2024-01-08T00:00:00.000Z');
  });

  test('checkReminders returns due items', async () => {
    const mgr = new WatchlistManager();
    await mgr.initializeStorage();

    const now = new Date('2024-01-10T00:00:00.000Z');
    jest.setSystemTime(now);

    // Insert two items: one due, one future
    await chrome.storage.local.set({
      watchlist_gameA: { id: 'gameA', dateAdded: '2024-01-01T00:00:00.000Z', reminderDate: '2024-01-05T00:00:00.000Z' },
      watchlist_gameB: { id: 'gameB', dateAdded: '2024-01-01T00:00:00.000Z', reminderDate: '2024-01-20T00:00:00.000Z' },
    });

    const due = await mgr.checkReminders();
    expect(due.map((d) => d.id)).toEqual(['gameA']);
  });
});



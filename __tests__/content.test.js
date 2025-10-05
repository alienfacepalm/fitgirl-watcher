/** @jest-environment jsdom */
const { FitGirlWatchlist } = require('../src/content.js');

function mockChrome(initialIds = []) {
  let ids = new Set(initialIds);
  const store = {};
  return {
    storage: {
      local: {
        get: jest.fn(async (keys) => {
          if (Array.isArray(keys)) {
            const out = {};
            keys.forEach((k) => (out[k] = k === 'watchlistItems' ? Array.from(ids) : store[k]));
            return out;
          }
          return { watchlistItems: Array.from(ids), ...store };
        }),
        set: jest.fn(async (obj) => {
          if (obj.watchlistItems) ids = new Set(obj.watchlistItems);
          Object.assign(store, obj);
        }),
        remove: jest.fn(async (keys) => {
          (Array.isArray(keys) ? keys : [keys]).forEach((k) => delete store[k]);
        }),
      },
    },
    runtime: { sendMessage: jest.fn() },
  };
}

describe('Content script parsing and toggle', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <article>
        <h2 class="entry-title">Awesome Game</h2>
        <a href="https://fitgirl-repacks.site/repack/awesome-game">Link</a>
        <img src="https://img/awesome.png" />
      </article>
    `;
    global.chrome = mockChrome();
  });

  afterEach(() => {
    delete global.chrome;
    document.body.innerHTML = '';
  });

  test('adds watchlist button and toggles state', async () => {
    const fg = new FitGirlWatchlist();
    await fg.setupWatchlist();

    // Ensure we pick the item-level button, not the top bar toggle
    const itemButton = document.querySelector('article .fitgirl-watchlist-btn');
    expect(itemButton).toBeTruthy();
    expect(itemButton.textContent).toMatch(/Add to Watchlist/);

    // Click to add
    itemButton.click();
    await Promise.resolve();
    expect(itemButton.textContent).toMatch(/In Watchlist/);

    // Click to remove
    itemButton.click();
    await Promise.resolve();
    expect(itemButton.textContent).toMatch(/Add to Watchlist/);
  });
});



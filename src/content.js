// FitGirl Repacks Watchlist Content Script
class FitGirlWatchlist {
  constructor() {
    this.watchlistItems = new Set();
    this.init();
  }

  async init() {
    // Wait for page to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupWatchlist()
      );
    } else {
      this.setupWatchlist();
    }
  }

  async setupWatchlist() {
    // Load existing watchlist items
    await this.loadWatchlistItems();

    // Add watchlist buttons to game items
    this.addWatchlistButtons();

    // Add top bar
    this.addTopBar();
  }

  async loadWatchlistItems() {
    try {
      const result = await chrome.storage.local.get(["watchlistItems"]);
      if (result.watchlistItems) {
        this.watchlistItems = new Set(result.watchlistItems);
      }
    } catch (error) {
      console.error("Error loading watchlist items:", error);
    }
  }

  addTopBar() {
    // Create top bar
    const topBar = document.createElement("div");
    topBar.id = "fitgirl-watchlist-bar";
    topBar.innerHTML = `
      <div class="fitgirl-watchlist-container">
        <div class="fitgirl-watchlist-header">
          <span class="fitgirl-watchlist-title">🎮 FitGirl Watchlist</span>
          <div class="fitgirl-watchlist-controls">
            <button id="fitgirl-watchlist-toggle" class="fitgirl-watchlist-btn">
              <span class="fitgirl-watchlist-icon">👁️</span>
              Toggle Watchlist
            </button>
            <button id="fitgirl-watchlist-settings" class="fitgirl-watchlist-btn">
              <span class="fitgirl-watchlist-icon">⚙️</span>
              Settings
            </button>
          </div>
        </div>
        <div id="fitgirl-watchlist-panel" class="fitgirl-watchlist-panel" style="display: none;">
          <div class="fitgirl-watchlist-stats">
            <span id="fitgirl-watchlist-count">0 items in watchlist</span>
          </div>
        </div>
      </div>
    `;

    // Insert at the top of the page
    document.body.insertBefore(topBar, document.body.firstChild);

    // Add event listeners
    this.addTopBarEventListeners();
  }

  addTopBarEventListeners() {
    const toggleBtn = document.getElementById("fitgirl-watchlist-toggle");
    const settingsBtn = document.getElementById("fitgirl-watchlist-settings");
    const panel = document.getElementById("fitgirl-watchlist-panel");

    toggleBtn?.addEventListener("click", () => {
      const isVisible = panel.style.display !== "none";
      panel.style.display = isVisible ? "none" : "block";
      this.updateWatchlistPanel();
    });

    settingsBtn?.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openSettings" });
    });
  }

  addWatchlistButtons() {
    // Find game items on the page (this will need to be adapted based on FitGirl's actual HTML structure)
    const gameItems = this.findGameItems();

    gameItems.forEach((item, index) => {
      if (!item.querySelector(".fitgirl-watchlist-btn")) {
        this.addWatchlistButtonToItem(item, index);
      }
    });
  }

  findGameItems() {
    // Common selectors for game items on FitGirl repacks
    const selectors = [
      ".post",
      ".entry",
      ".game-item",
      "article",
      ".content .post",
      ".main-content .post",
    ];

    let items = [];
    for (const selector of selectors) {
      items = document.querySelectorAll(selector);
      if (items.length > 0) break;
    }

    // If no specific game items found, look for links that might be games
    if (items.length === 0) {
      items = document.querySelectorAll(
        'a[href*="/repack/"], a[href*="/game/"]'
      );
    }

    return Array.from(items);
  }

  addWatchlistButtonToItem(item, index) {
    const gameInfo = this.extractGameInfo(item);
    const gameId = this.generateGameId(gameInfo);

    const isInWatchlist = this.watchlistItems.has(gameId);

    const button = document.createElement("button");
    button.className = `fitgirl-watchlist-btn ${
      isInWatchlist ? "in-watchlist" : ""
    }`;
    button.innerHTML = `
      <span class="fitgirl-watchlist-icon">${isInWatchlist ? "✅" : "➕"}</span>
      <span class="fitgirl-watchlist-text">${
        isInWatchlist ? "In Watchlist" : "Add to Watchlist"
      }</span>
    `;

    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleWatchlistItem(gameId, gameInfo, button);
    });

    // Insert button into the item
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "fitgirl-watchlist-button-container";
    buttonContainer.appendChild(button);

    // Try to find a good place to insert the button
    const titleElement = item.querySelector("h1, h2, h3, .title, .entry-title");
    if (titleElement) {
      titleElement.parentNode.insertBefore(
        buttonContainer,
        titleElement.nextSibling
      );
    } else {
      item.appendChild(buttonContainer);
    }
  }

  extractGameInfo(item) {
    // Priority order for finding the correct game link:
    // FitGirl uses WordPress, so look for permalink in title
    let linkElement =
      item.querySelector('h2.entry-title a[rel="bookmark"]') ||
      item.querySelector('h1.entry-title a[rel="bookmark"]') ||
      item.querySelector('.entry-title a[rel="bookmark"]') ||
      item.querySelector("h2.entry-title a") ||
      item.querySelector('h1 a[rel="bookmark"]') ||
      item.querySelector('h2 a[rel="bookmark"]') ||
      item.querySelector('a[rel="bookmark"]') ||
      item.querySelector("h1 a, h2 a, h3 a");

    // Get title from link or title element
    let title = "Unknown Game";
    if (linkElement) {
      title = linkElement.textContent || linkElement.innerText;
    } else {
      const titleElement = item.querySelector("h1, h2, h3, .entry-title");
      if (titleElement) {
        title = titleElement.textContent || titleElement.innerText;
      }
    }

    const imageElement = item.querySelector("img");

    // Get the actual game URL
    let gameUrl = null;

    if (linkElement && linkElement.href) {
      // Filter out unwanted URLs (categories, tags, etc)
      const href = linkElement.href;
      if (
        !href.includes("/category/") &&
        !href.includes("/tag/") &&
        !href.includes("/page/") &&
        !href.includes("#") &&
        href.includes("fitgirl-repacks.site/")
      ) {
        gameUrl = href;
        console.log(
          "✓ Found game link:",
          gameUrl,
          "for",
          title.substring(0, 50)
        );
      }
    } else if (
      !window.location.href.includes("/category/") &&
      !window.location.href.includes("/tag/") &&
      !window.location.href.includes("/page/")
    ) {
      // If we're on a single game page, use current URL
      gameUrl = window.location.href;
      console.log("✓ Using current page URL:", gameUrl);
    }

    if (!gameUrl) {
      console.warn(
        "✗ Could not find valid game URL for:",
        title.substring(0, 50)
      );
    }

    return {
      title: title.trim(),
      url: gameUrl,
      image: imageElement?.src || "",
      dateAdded: new Date().toISOString(),
      domain: window.location.hostname,
    };
  }

  generateGameId(gameInfo) {
    // Create a unique ID based on URL and title
    return btoa(
      encodeURIComponent(gameInfo.url + "|" + gameInfo.title)
    ).replace(/[^a-zA-Z0-9]/g, "");
  }

  async toggleWatchlistItem(gameId, gameInfo, button) {
    try {
      // Validate that we have a proper game URL
      if (
        !gameInfo.url ||
        gameInfo.url.includes("/category/") ||
        gameInfo.url.includes("/tag/")
      ) {
        this.showNotification(
          "Could not find game URL. Please open the game page directly.",
          "error"
        );
        return;
      }

      if (this.watchlistItems.has(gameId)) {
        // Remove from watchlist
        this.watchlistItems.delete(gameId);
        button.innerHTML = `
          <span class="fitgirl-watchlist-icon">➕</span>
          <span class="fitgirl-watchlist-text">Add to Watchlist</span>
        `;
        button.classList.remove("in-watchlist");

        // Remove from storage
        await chrome.storage.local.remove([`watchlist_${gameId}`]);
      } else {
        // Add to watchlist
        this.watchlistItems.add(gameId);
        button.innerHTML = `
          <span class="fitgirl-watchlist-icon">✅</span>
          <span class="fitgirl-watchlist-text">In Watchlist</span>
        `;
        button.classList.add("in-watchlist");

        // Save to storage with validated URL
        await chrome.storage.local.set({
          [`watchlist_${gameId}`]: {
            id: gameId,
            ...gameInfo,
            url: gameInfo.url, // Ensure URL is saved
            reminderDate: this.calculateReminderDate(),
          },
        });

        console.log(
          "Added to watchlist:",
          gameInfo.title,
          "URL:",
          gameInfo.url
        );
      }

      // Update watchlist items array in storage
      await chrome.storage.local.set({
        watchlistItems: Array.from(this.watchlistItems),
      });

      this.updateWatchlistPanel();
      this.showNotification(
        this.watchlistItems.has(gameId)
          ? "Added to watchlist!"
          : "Removed from watchlist!"
      );
    } catch (error) {
      console.error("Error toggling watchlist item:", error);
      this.showNotification("Error updating watchlist", "error");
    }
  }

  calculateReminderDate() {
    // Default reminder in 7 days, can be customized in settings
    const reminderDays = 7;
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + reminderDays);
    return reminderDate.toISOString();
  }

  async updateWatchlistPanel() {
    const countElement = document.getElementById("fitgirl-watchlist-count");
    if (countElement) {
      countElement.textContent = `${this.watchlistItems.size} items in watchlist`;
    }
  }

  showNotification(message, type = "success") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `fitgirl-watchlist-notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize the watchlist when the script loads
new FitGirlWatchlist();

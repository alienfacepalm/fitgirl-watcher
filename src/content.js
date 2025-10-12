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
    // Show welcome notice
    this.showWelcomeNotice();

    // Load existing watchlist items
    await this.loadWatchlistItems();

    // Add watchlist buttons to game items
    this.addWatchlistButtons();
  }

  showWelcomeNotice() {
    // Check if we've shown the notice recently (within the last hour)
    const lastShown = localStorage.getItem("fitgirl-watchlist-notice-shown");
    const now = Date.now();
    const oneHourMs = 60 * 60 * 1000;

    if (lastShown && now - parseInt(lastShown) < oneHourMs) {
      return; // Don't show if shown within the last hour
    }

    // Create welcome notice
    const notice = document.createElement("div");
    notice.className = "fitgirl-watchlist-toast";
    notice.innerHTML = `
      🎮 FitGirl Watchlist Active! Click the extension icon to view your watchlist.
    `;

    document.body.appendChild(notice);

    // Animate in
    setTimeout(() => notice.classList.add("show"), 100);

    // Auto-dismiss after 5 seconds
    const autoDismiss = setTimeout(() => {
      this.dismissWelcomeNotice(notice);
    }, 5000);

    // Manual dismiss on click
    notice.addEventListener("click", () => {
      clearTimeout(autoDismiss);
      this.dismissWelcomeNotice(notice);
    });

    // Remember we showed it
    localStorage.setItem("fitgirl-watchlist-notice-shown", now.toString());
  }

  dismissWelcomeNotice(notice) {
    notice.classList.remove("show");
    setTimeout(() => notice.remove(), 300);
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
    // Check if we're on a single game page (not a listing)
    const isSinglePage =
      window.location.pathname.length > 1 &&
      !window.location.pathname.includes("/category/") &&
      !window.location.pathname.includes("/tag/");

    let title = "Unknown Game";
    let linkElement = null;

    if (isSinglePage) {
      // On single game page - try multiple sources for title
      // 1. Try getting from document title first (most reliable)
      const docTitle = document.title;
      if (
        docTitle &&
        !docTitle.includes("FitGirl Repacks") &&
        docTitle.trim().length > 0
      ) {
        // Remove " – FitGirl Repacks" suffix if present
        title = docTitle.replace(/\s*[–-]\s*FitGirl Repacks.*$/i, "").trim();
        console.log("Extracted title from document.title:", title);
      }

      // 2. If that didn't work, try h1.entry-title
      if (title === "Unknown Game") {
        const h1Title = document.querySelector("h1.entry-title");
        if (h1Title) {
          title = (h1Title.textContent || h1Title.innerText || "").trim();
          console.log("Extracted title from page h1:", title);
        }
      }

      // 3. Last resort: try og:title meta tag
      if (title === "Unknown Game") {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && ogTitle.content) {
          title = ogTitle.content
            .replace(/\s*[–-]\s*FitGirl Repacks.*$/i, "")
            .trim();
          console.log("Extracted title from og:title:", title);
        }
      }
    } else {
      // On listing page - get title from link in the post item
      linkElement =
        item.querySelector('h1.entry-title a[rel="bookmark"]') ||
        item.querySelector('h2.entry-title a[rel="bookmark"]') ||
        item.querySelector('.entry-title a[rel="bookmark"]') ||
        item.querySelector("h1.entry-title a") ||
        item.querySelector("h2.entry-title a") ||
        item.querySelector('h1 a[rel="bookmark"]') ||
        item.querySelector('h2 a[rel="bookmark"]') ||
        item.querySelector('a[rel="bookmark"]');

      if (linkElement) {
        title = (linkElement.textContent || linkElement.innerText || "").trim();
        console.log("Extracted title from link:", title);
      }
    }

    // Clean up the title
    if (title && title !== "Unknown Game") {
      // Remove extra whitespace
      title = title.replace(/\s+/g, " ").trim();

      // Remove date patterns at the start (e.g., "01/10/2025 Title" -> "Title")
      title = title.replace(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\s+/, "");

      // Remove "FitGirl" author tag if present at the end
      title = title.replace(/\s+FitGirl\s*$/i, "");

      console.log("Cleaned title:", title);
    }

    // Final validation
    if (!title || title.trim().length === 0) {
      console.warn("Empty title detected");
      title = "Unknown Game";
    } else if (title.length < 3) {
      console.warn("Title too short:", title);
      title = "Unknown Game";
    } else if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(title.trim())) {
      console.warn("Title is only a date:", title);
      title = "Unknown Game";
    } else {
      console.log("✓ Final valid title:", title);
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

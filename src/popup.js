// FitGirl Watchlist Popup Script
class PopupManager {
  constructor() {
    this.watchlistItems = [];
    this.filteredItems = [];
    this.currentTab = "watchlist";
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadWatchlistItems();
    await this.loadSettings();
    this.renderWatchlist();
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Search functionality
    const searchInput = document.getElementById("search-input");
    const clearSearch = document.getElementById("clear-search");

    searchInput.addEventListener("input", (e) => {
      this.filterItems(e.target.value);
    });

    clearSearch.addEventListener("click", () => {
      searchInput.value = "";
      this.filterItems("");
    });

    // Settings
    document.getElementById("reminder-days").addEventListener("change", (e) => {
      this.saveSettings();
    });

    document.getElementById("reminder-time").addEventListener("change", (e) => {
      this.saveSettings();
    });

    document
      .getElementById("enable-notifications")
      .addEventListener("change", (e) => {
        this.saveSettings();
      });

    // Data management
    document.getElementById("export-data").addEventListener("click", () => {
      this.exportData();
    });

    document.getElementById("import-data").addEventListener("click", () => {
      document.getElementById("import-file").click();
    });

    document.getElementById("import-file").addEventListener("change", (e) => {
      this.importData(e.target.files[0]);
    });

    document.getElementById("clear-all-data").addEventListener("click", () => {
      this.clearAllData();
    });

    // Visit FitGirl button
    document.getElementById("visit-fitgirl").addEventListener("click", () => {
      chrome.tabs.create({ url: "https://fitgirl-repacks.site/" });
    });
  }

  switchTab(tabName) {
    // Update nav buttons
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Update tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${tabName}-tab`).classList.add("active");

    this.currentTab = tabName;
  }

  async loadWatchlistItems() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: "getWatchlistItems",
      });
      if (response.success) {
        this.watchlistItems = response.data;
        this.filteredItems = [...this.watchlistItems];
        this.updateStats();
        this.renderWatchlist();
      }
    } catch (error) {
      console.error("Error loading watchlist items:", error);
      this.showError("Failed to load watchlist items");
    }
  }

  async loadSettings() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: "getReminderSettings",
      });
      if (response.success) {
        const settings = response.data;
        document.getElementById("reminder-days").value =
          settings.defaultReminderDays;
        document.getElementById("reminder-time").value = settings.reminderTime;
        document.getElementById("enable-notifications").checked =
          settings.enableNotifications;
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  }

  async saveSettings() {
    try {
      const settings = {
        defaultReminderDays: parseInt(
          document.getElementById("reminder-days").value
        ),
        reminderTime: document.getElementById("reminder-time").value,
        enableNotifications: document.getElementById("enable-notifications")
          .checked,
      };

      const response = await chrome.runtime.sendMessage({
        action: "updateReminderSettings",
        data: settings,
      });

      if (response.success) {
        this.showSuccess("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      this.showError("Failed to save settings");
    }
  }

  filterItems(searchTerm) {
    if (!searchTerm.trim()) {
      this.filteredItems = [...this.watchlistItems];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredItems = this.watchlistItems.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.url.toLowerCase().includes(term)
      );
    }
    this.renderWatchlist();
  }

  sortItems(sortBy) {
    this.filteredItems.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "reminderDate":
          return new Date(a.reminderDate) - new Date(b.reminderDate);
        case "dateAdded":
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });
    this.renderWatchlist();
  }

  renderWatchlist() {
    const container = document.getElementById("watchlist-items");

    if (this.filteredItems.length === 0) {
      if (this.watchlistItems.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🎮</div>
            <h3>No games in your watchlist</h3>
            <p>Visit FitGirl Repacks and click the "Add to Watchlist" button to start tracking games!</p>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No games found</h3>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        `;
      }
      return;
    }

    container.innerHTML = this.filteredItems
      .map((item) => this.renderWatchlistItem(item))
      .join("");

    // Add event listeners to action buttons
    container.querySelectorAll(".remove-btn-small").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemId = e.target.dataset.itemId;
        this.removeFromWatchlist(itemId);
      });
    });

    container.querySelectorAll(".visit-btn-small").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const url = e.target.dataset.url;
        chrome.tabs.create({ url });
      });
    });
  }

  renderWatchlistItem(item) {
    // Format dates properly - use en-US locale for consistent MM/DD/YYYY format
    const dateAdded = new Date(item.dateAdded).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const reminderDate = new Date(item.reminderDate).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );
    const isOverdue = new Date(item.reminderDate) < new Date();

    // Ensure we have a proper title (not empty or undefined)
    const title =
      item.title && item.title.trim() ? item.title : "Untitled Game";

    return `
      <div class="watchlist-item ${isOverdue ? "overdue" : ""}">
        <div class="item-header">
          <div class="item-title">${this.escapeHtml(title)}</div>
          <div class="item-actions">
            <button class="action-btn-small visit-btn-small" data-url="${
              item.url
            }">
              Visit
            </button>
            <button class="action-btn-small remove-btn-small" data-item-id="${
              item.id
            }">
              Remove
            </button>
          </div>
        </div>
        <div class="item-meta">
          <span>Added: ${dateAdded}</span>
          <span class="${
            isOverdue ? "overdue-text" : ""
          }">Reminder: ${reminderDate}</span>
        </div>
        <a href="${item.url}" class="item-url" target="_blank">${item.url}</a>
      </div>
    `;
  }

  async removeFromWatchlist(itemId) {
    if (
      !confirm("Are you sure you want to remove this item from your watchlist?")
    ) {
      return;
    }

    try {
      const response = await chrome.runtime.sendMessage({
        action: "removeFromWatchlist",
        data: { id: itemId },
      });

      if (response.success) {
        this.showSuccess("Item removed from watchlist");
        await this.loadWatchlistItems();
      }
    } catch (error) {
      console.error("Error removing item:", error);
      this.showError("Failed to remove item");
    }
  }

  exportData() {
    try {
      const data = {
        watchlistItems: this.watchlistItems,
        exportDate: new Date().toISOString(),
        version: "1.0.0",
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `fitgirl-watchlist-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showSuccess("Watchlist exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      this.showError("Failed to export data");
    }
  }

  async importData(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.watchlistItems || !Array.isArray(data.watchlistItems)) {
        throw new Error("Invalid file format");
      }

      if (
        !confirm(
          `Import ${data.watchlistItems.length} items from ${
            data.exportDate || "unknown date"
          }?`
        )
      ) {
        return;
      }

      // Clear existing data
      await chrome.storage.local.clear();

      // Import new data
      for (const item of data.watchlistItems) {
        await chrome.storage.local.set({
          [`watchlist_${item.id}`]: item,
        });
      }

      await chrome.storage.local.set({
        watchlistItems: data.watchlistItems.map((item) => item.id),
      });

      this.showSuccess("Watchlist imported successfully!");
      await this.loadWatchlistItems();
    } catch (error) {
      console.error("Error importing data:", error);
      this.showError("Failed to import data. Please check the file format.");
    }
  }

  async clearAllData() {
    if (
      !confirm(
        "Are you sure you want to clear all watchlist data? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await chrome.storage.local.clear();
      this.showSuccess("All data cleared successfully!");
      await this.loadWatchlistItems();
    } catch (error) {
      console.error("Error clearing data:", error);
      this.showError("Failed to clear data");
    }
  }

  updateStats() {
    const totalItems = document.getElementById("total-items");
    totalItems.textContent = `${this.watchlistItems.length} items`;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  showSuccess(message) {
    this.showNotification(message, "success");
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showNotification(message, type = "info") {
    // Remove existing notifications
    const existing = document.querySelector(".popup-notification");
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement("div");
    notification.className = `popup-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${
        type === "success"
          ? "#28a745"
          : type === "error"
          ? "#dc3545"
          : "#17a2b8"
      };
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PopupManager();
});

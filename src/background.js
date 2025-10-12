// FitGirl Repacks Watchlist Background Script
class WatchlistManager {
  constructor() {
    this.init();
  }

  init() {
    // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Set up alarm for reminders
    this.setupReminderAlarm();

    // Initialize storage
    this.initializeStorage();

    // Manage extension icon visibility
    this.setupIconVisibility();
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case "getWatchlistItems":
          const items = await this.getWatchlistItems();
          sendResponse({ success: true, data: items });
          break;

        case "addToWatchlist":
          const addResult = await this.addToWatchlist(message.data);
          sendResponse({ success: true, data: addResult });
          break;

        case "removeFromWatchlist":
          const removeResult = await this.removeFromWatchlist(message.data.id);
          sendResponse({ success: true, data: removeResult });
          break;

        case "updateReminderSettings":
          const settingsResult = await this.updateReminderSettings(
            message.data
          );
          sendResponse({ success: true, data: settingsResult });
          break;

        case "getReminderSettings":
          const settings = await this.getReminderSettings();
          sendResponse({ success: true, data: settings });
          break;

        case "checkReminders":
          const reminders = await this.checkReminders();
          sendResponse({ success: true, data: reminders });
          break;

        case "openSettings":
          chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: "Unknown action" });
      }
    } catch (error) {
      console.error("Background script error:", error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async initializeStorage() {
    try {
      // Initialize default settings if they don't exist
      const result = await chrome.storage.local.get([
        "reminderSettings",
        "watchlistItems",
      ]);

      if (!result.reminderSettings) {
        await chrome.storage.local.set({
          reminderSettings: {
            defaultReminderDays: 7,
            enableNotifications: true,
            reminderTime: "09:00",
          },
        });
      }

      if (!result.watchlistItems) {
        await chrome.storage.local.set({
          watchlistItems: [],
        });
      }
    } catch (error) {
      console.error("Error initializing storage:", error);
    }
  }

  async getWatchlistItems() {
    try {
      const result = await chrome.storage.local.get(null);
      const items = [];

      // Get all watchlist items
      for (const [key, value] of Object.entries(result)) {
        if (key.startsWith("watchlist_") && typeof value === "object") {
          items.push(value);
        }
      }

      // Sort by date added (newest first)
      return items.sort(
        (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
      );
    } catch (error) {
      console.error("Error getting watchlist items:", error);
      return [];
    }
  }

  async addToWatchlist(gameData) {
    try {
      const gameId = gameData.id;
      const reminderSettings = await this.getReminderSettings();

      const watchlistItem = {
        ...gameData,
        reminderDate: this.calculateReminderDate(
          reminderSettings.defaultReminderDays
        ),
        dateAdded: new Date().toISOString(),
      };

      await chrome.storage.local.set({
        [`watchlist_${gameId}`]: watchlistItem,
      });

      // Update watchlist items array
      const result = await chrome.storage.local.get(["watchlistItems"]);
      const watchlistItems = result.watchlistItems || [];
      if (!watchlistItems.includes(gameId)) {
        watchlistItems.push(gameId);
        await chrome.storage.local.set({ watchlistItems });
      }

      return watchlistItem;
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      throw error;
    }
  }

  async removeFromWatchlist(gameId) {
    try {
      // Remove the item
      await chrome.storage.local.remove([`watchlist_${gameId}`]);

      // Update watchlist items array
      const result = await chrome.storage.local.get(["watchlistItems"]);
      const watchlistItems = result.watchlistItems || [];
      const updatedItems = watchlistItems.filter((id) => id !== gameId);
      await chrome.storage.local.set({ watchlistItems: updatedItems });

      return { success: true };
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      throw error;
    }
  }

  async updateReminderSettings(settings) {
    try {
      await chrome.storage.local.set({
        reminderSettings: {
          ...settings,
          lastUpdated: new Date().toISOString(),
        },
      });

      // Update existing watchlist items with new reminder dates
      await this.updateExistingReminders(settings.defaultReminderDays);

      return { success: true };
    } catch (error) {
      console.error("Error updating reminder settings:", error);
      throw error;
    }
  }

  async getReminderSettings() {
    try {
      const result = await chrome.storage.local.get(["reminderSettings"]);
      return (
        result.reminderSettings || {
          defaultReminderDays: 7,
          enableNotifications: true,
          reminderTime: "09:00",
        }
      );
    } catch (error) {
      console.error("Error getting reminder settings:", error);
      return {
        defaultReminderDays: 7,
        enableNotifications: true,
        reminderTime: "09:00",
      };
    }
  }

  async updateExistingReminders(newReminderDays) {
    try {
      const items = await this.getWatchlistItems();

      for (const item of items) {
        const newReminderDate = this.calculateReminderDate(newReminderDays);
        await chrome.storage.local.set({
          [`watchlist_${item.id}`]: {
            ...item,
            reminderDate: newReminderDate,
          },
        });
      }
    } catch (error) {
      console.error("Error updating existing reminders:", error);
    }
  }

  calculateReminderDate(days) {
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + days);
    return reminderDate.toISOString();
  }

  async checkReminders() {
    try {
      const items = await this.getWatchlistItems();
      const now = new Date();
      const dueReminders = [];

      for (const item of items) {
        const reminderDate = new Date(item.reminderDate);
        if (reminderDate <= now) {
          dueReminders.push(item);
        }
      }

      return dueReminders;
    } catch (error) {
      console.error("Error checking reminders:", error);
      return [];
    }
  }

  async setupReminderAlarm() {
    try {
      // Clear existing alarms
      const alarms = await chrome.alarms.getAll();
      for (const alarm of alarms) {
        if (alarm.name.startsWith("fitgirl-reminder-")) {
          chrome.alarms.clear(alarm.name);
        }
      }

      // Set up daily reminder check
      chrome.alarms.create("fitgirl-daily-reminder-check", {
        delayInMinutes: 1,
        periodInMinutes: 24 * 60, // Check every 24 hours
      });

      // Listen for alarm events
      chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === "fitgirl-daily-reminder-check") {
          this.handleDailyReminderCheck();
        }
      });
    } catch (error) {
      console.error("Error setting up reminder alarm:", error);
    }
  }

  async handleDailyReminderCheck() {
    try {
      const dueReminders = await this.checkReminders();
      const settings = await this.getReminderSettings();

      if (dueReminders.length > 0 && settings.enableNotifications) {
        // Show notification
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon48.png",
          title: "FitGirl Watchlist Reminder",
          message: `You have ${dueReminders.length} game(s) to check out!`,
        });

        // Update reminder dates for next check
        for (const item of dueReminders) {
          const newReminderDate = this.calculateReminderDate(
            settings.defaultReminderDays
          );
          await chrome.storage.local.set({
            [`watchlist_${item.id}`]: {
              ...item,
              reminderDate: newReminderDate,
              lastReminded: new Date().toISOString(),
            },
          });
        }
      }
    } catch (error) {
      console.error("Error handling daily reminder check:", error);
    }
  }

  setupIconVisibility() {
    // Check if on FitGirl site and enable/disable icon accordingly
    const checkTab = async (tabId, url) => {
      if (!url) return;
      
      const isFitGirlSite = url.includes('fitgirl-repacks.site');
      
      if (isFitGirlSite) {
        await chrome.action.enable(tabId);
      } else {
        await chrome.action.disable(tabId);
      }
    };

    // Listen for tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        checkTab(tabId, changeInfo.url);
      }
    });

    // Listen for tab activation (switching between tabs)
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      checkTab(activeInfo.tabId, tab.url);
    });

    // Check current active tab on startup
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]) {
        checkTab(tabs[0].id, tabs[0].url);
      }
    });
  }
}

// Initialize the watchlist manager
new WatchlistManager();

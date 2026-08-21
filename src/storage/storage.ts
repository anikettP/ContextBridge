import { DEFAULT_SETTINGS } from "../shared/constants";
import { ExtensionSettings, SavedProjectMemory } from "../shared/types";

const STORAGE_KEYS = {
  SETTINGS: "cb_extension_settings",
  PROJECT_MEMORIES: "cb_project_memories",
  ACTIVE_CONTEXT: "cb_active_context"
};

export class StorageService {
  /**
   * Retrieves extension settings from chrome storage or returns defaults.
   */
  public async getSettings(): Promise<ExtensionSettings> {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
      return DEFAULT_SETTINGS;
    }
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEYS.SETTINGS, (result) => {
        resolve(result[STORAGE_KEYS.SETTINGS] || DEFAULT_SETTINGS);
      });
    });
  }

  /**
   * Saves updated extension settings into chrome storage.
   */
  public async saveSettings(settings: ExtensionSettings): Promise<void> {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) return;
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings }, () => resolve());
    });
  }

  /**
   * Retrieves all saved project memories.
   */
  public async getSavedMemories(): Promise<SavedProjectMemory[]> {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) return [];
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEYS.PROJECT_MEMORIES, (result) => {
        resolve(result[STORAGE_KEYS.PROJECT_MEMORIES] || []);
      });
    });
  }

  /**
   * Saves a new project memory snapshot.
   */
  public async saveMemory(memory: SavedProjectMemory): Promise<void> {
    const existing = await this.getSavedMemories();
    const updated = [memory, ...existing.filter((m) => m.id !== memory.id)];
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) return;
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.PROJECT_MEMORIES]: updated }, () => resolve());
    });
  }

  /**
   * Deletes a saved project memory snapshot.
   */
  public async deleteMemory(id: string): Promise<void> {
    const existing = await this.getSavedMemories();
    const updated = existing.filter((m) => m.id !== id);
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) return;
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.PROJECT_MEMORIES]: updated }, () => resolve());
    });
  }

  /**
   * Saves active formatted context in storage for tab transfer.
   */
  public async setActiveContext(formattedMarkdown: string): Promise<void> {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) return;
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.ACTIVE_CONTEXT]: formattedMarkdown }, () => resolve());
    });
  }

  /**
   * Retrieves active context markdown.
   */
  public async getActiveContext(): Promise<string | null> {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) return null;
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEYS.ACTIVE_CONTEXT, (result) => {
        resolve(result[STORAGE_KEYS.ACTIVE_CONTEXT] || null);
      });
    });
  }
}

export const storageService = new StorageService();

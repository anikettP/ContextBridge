import { describe, expect, it } from "vitest";
import { StorageService } from "../src/storage/storage";
import { SavedProjectMemory } from "../src/shared/types";

describe("Storage Service Test Suite", () => {
  it("should handle default fallback settings when chrome storage is not present", async () => {
    const storage = new StorageService();
    const settings = await storage.getSettings();
    expect(settings.defaultStrategy).toBe("smart");
    expect(settings.preferredTargetProvider).toBe("claude");
  });

  it("should handle memory list empty fallback", async () => {
    const storage = new StorageService();
    const memories = await storage.getSavedMemories();
    expect(memories).toEqual([]);
  });
});

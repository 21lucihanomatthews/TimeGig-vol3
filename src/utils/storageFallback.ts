/**
 * Bulletproof localStorage Fail-Safe Polyfill
 * Prevents Uncaught SecurityError (blocked third-party context inside iframes)
 * and DOMException QuotaExceededError (full browser storage) globally.
 */

try {
  let localStorageWorks = false;
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    const testVal = window.localStorage.getItem(testKey);
    window.localStorage.removeItem(testKey);
    localStorageWorks = testVal === testKey;
  } catch (e) {
    localStorageWorks = false;
  }

  const memoryStore: Record<string, string> = {};

  if (!localStorageWorks) {
    console.warn('[Storage Fallback] window.localStorage is blocked or unavailable. Injecting in-memory fallback.');
    
    const mockStorage: Storage = {
      length: 0,
      clear() {
        for (const k in memoryStore) {
          delete memoryStore[k];
        }
        this.length = 0;
      },
      getItem(key: string) {
        return memoryStore[key] === undefined ? null : memoryStore[key];
      },
      key(index: number) {
        return Object.keys(memoryStore)[index] || null;
      },
      removeItem(key: string) {
        delete memoryStore[key];
        this.length = Object.keys(memoryStore).length;
      },
      setItem(key: string, value: any) {
        memoryStore[key] = String(value);
        this.length = Object.keys(memoryStore).length;
      }
    };

    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: true,
        configurable: true
      });
    } catch (e) {
      console.error('[Storage Fallback] Critically failed to overwrite window.localStorage property:', e);
    }
  } else {
    // If localStorage works but might throw QuotaExceededError later, wrap the prototype methods defensively
    const originalGetItem = Storage.prototype.getItem;
    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    const originalClear = Storage.prototype.clear;

    Storage.prototype.getItem = function (key: string) {
      try {
        return originalGetItem.call(this, key);
      } catch (e) {
        return memoryStore[key] === undefined ? null : memoryStore[key];
      }
    };

    Storage.prototype.setItem = function (key: string, value: any) {
      try {
        originalSetItem.call(this, key, String(value));
      } catch (e) {
        console.warn(`[Storage Fallback] setItem failed for "${key}" (likely quota exceeded). Redirecting to memory.`, e);
        memoryStore[key] = String(value);
      }
    };

    Storage.prototype.removeItem = function (key: string) {
      try {
        originalRemoveItem.call(this, key);
      } catch (e) {
        delete memoryStore[key];
      }
    };

    Storage.prototype.clear = function () {
      try {
        originalClear.call(this);
      } catch (e) {
        for (const k in memoryStore) {
          delete memoryStore[k];
        }
      }
    };
  }
} catch (e) {
  console.error('[Storage Fallback] Extreme fallback failure:', e);
}

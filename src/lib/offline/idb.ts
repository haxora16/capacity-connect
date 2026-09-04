/**
 * IndexedDB helper for Offline Capability in CAPACITY CONNECT
 * Stores:
 * - 'offline_courses': cached course modules & text/pdf metadata
 * - 'offline_questions': cached assessment questions for offline attempts
 * - 'pending_attempts': assessment submissions made while offline to be synced
 */

const DB_NAME = "CapacityConnect_OfflineDB";
const DB_VERSION = 1;

export interface OfflineCourseCache {
  id: string;
  code: string;
  title: string;
  subject: string;
  modules: {
    id: string;
    title: string;
    content: string;
    resourceType: string;
    durationMin: number;
  }[];
  savedAt: string;
}

export interface OfflineAttemptSubmission {
  id: string;
  assessmentId: string;
  userId: string;
  answers: { questionId: string; selectedOption: number }[];
  timeTakenSec: number;
  completedAt: string;
  synced: boolean;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return reject(new Error("IndexedDB not available"));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("offline_courses")) {
        db.createObjectStore("offline_courses", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("pending_attempts")) {
        db.createObjectStore("pending_attempts", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCourseOffline(course: OfflineCourseCache): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction("offline_courses", "readwrite");
    const store = tx.objectStore("offline_courses");
    store.put(course);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Failed to save course offline:", err);
  }
}

export async function getOfflineCourses(): Promise<OfflineCourseCache[]> {
  try {
    const db = await openDB();
    const tx = db.transaction("offline_courses", "readonly");
    const store = tx.objectStore("offline_courses");
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Failed to retrieve offline courses:", err);
    return [];
  }
}

export async function queueOfflineAttempt(attempt: OfflineAttemptSubmission): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction("pending_attempts", "readwrite");
    const store = tx.objectStore("pending_attempts");
    store.put(attempt);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Failed to queue offline attempt:", err);
  }
}

export async function getPendingAttempts(): Promise<OfflineAttemptSubmission[]> {
  try {
    const db = await openDB();
    const tx = db.transaction("pending_attempts", "readonly");
    const store = tx.objectStore("pending_attempts");
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Failed to read pending attempts:", err);
    return [];
  }
}

export async function clearPendingAttempt(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction("pending_attempts", "readwrite");
    const store = tx.objectStore("pending_attempts");
    store.delete(id);
  } catch (err) {
    console.error("Failed to clear synced attempt:", err);
  }
}

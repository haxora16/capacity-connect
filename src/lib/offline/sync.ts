import { getPendingAttempts, clearPendingAttempt } from "./idb";

export async function syncPendingData(): Promise<{ syncedCount: number; errors: number }> {
  if (typeof window === "undefined" || !navigator.onLine) {
    return { syncedCount: 0, errors: 0 };
  }

  const pending = await getPendingAttempts();
  if (pending.length === 0) {
    return { syncedCount: 0, errors: 0 };
  }

  let syncedCount = 0;
  let errors = 0;

  for (const attempt of pending) {
    try {
      const res = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: attempt.assessmentId,
          userId: attempt.userId,
          answers: attempt.answers,
          timeTakenSec: attempt.timeTakenSec,
          isOfflineSync: true,
        }),
      });

      if (res.ok) {
        await clearPendingAttempt(attempt.id);
        syncedCount++;
      } else {
        errors++;
      }
    } catch (err) {
      console.error("Error syncing attempt:", err);
      errors++;
    }
  }

  return { syncedCount, errors };
}

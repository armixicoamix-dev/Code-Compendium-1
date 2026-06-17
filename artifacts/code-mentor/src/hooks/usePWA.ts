import { useState, useEffect, useCallback } from "react";
import { preloadForOffline, PreloadProgress } from "@/lib/offlinePreloader";

export type OfflineStatus = "unknown" | "not-installed" | "caching" | "ready" | "error";

export interface PWAInfo {
  status: OfflineStatus;
  isOnline: boolean;
  /** Human-readable label of the current caching step */
  cacheProgress: string;
  /** 0–100 percent completion while caching */
  cachePct: number;
  cacheForOffline: () => Promise<void>;
  swRegistered: boolean;
}

export function usePWA(): PWAInfo {
  const [status, setStatus] = useState<OfflineStatus>("unknown");
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [cacheProgress, setCacheProgress] = useState("");
  const [cachePct, setCachePct] = useState(0);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    const up = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);

    if (!("serviceWorker" in navigator)) {
      setStatus("error");
      return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(async (reg) => {
        setSwRegistered(true);
        // Check whether we already have cached assets
        const count = await estimateCachedCount(reg);
        if (count > 5) {
          setStatus("ready");
        } else {
          setStatus("not-installed");
        }
      })
      .catch(() => setStatus("not-installed")); // Non-fatal: SW may not be supported in dev

    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);

  const cacheForOffline = useCallback(async () => {
    if (status === "caching") return;
    setStatus("caching");
    setCachePct(0);
    setCacheProgress("Подготовка…");

    const onProgress = (p: PreloadProgress) => {
      setCacheProgress(p.label);
      setCachePct(p.pct);
    };

    try {
      await preloadForOffline(onProgress);
      setStatus("ready");
    } catch (err) {
      console.warn("[PWA] preload failed:", err);
      setStatus("error");
      setCacheProgress("Ошибка при кэшировании — попробуй ещё раз");
    }
  }, [status]);

  return { status, isOnline, cacheProgress, cachePct, cacheForOffline, swRegistered };
}

/** Ask the SW how many resources are cached (proxy for "is it ready?") */
async function estimateCachedCount(reg: ServiceWorkerRegistration): Promise<number> {
  const sw = reg.active || reg.installing || reg.waiting;
  if (!sw) return 0;
  return new Promise<number>((resolve) => {
    const ch = new MessageChannel();
    ch.port1.onmessage = (e) => resolve((e.data?.total as number) ?? 0);
    sw.postMessage({ type: "GET_CACHE_SIZE" }, [ch.port2]);
    setTimeout(() => resolve(0), 2000);
  });
}

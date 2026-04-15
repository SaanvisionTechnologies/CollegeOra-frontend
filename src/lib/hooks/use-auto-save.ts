"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutoSave(
  saveFn: () => Promise<void>,
  deps: unknown[],
  delay = 1500
) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  const isFirstRender = useRef(true);
  const saveFnRef = useRef(saveFn);
  saveFnRef.current = saveFn;

  const save = useCallback(async () => {
    setStatus("saving");
    try {
      await saveFnRef.current();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(save, delay);

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return status;
}

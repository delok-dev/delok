// src/hooks/useCooldown.ts
"use client";

import { useEffect, useRef, useState } from "react";

export const ACTION_COOLDOWN_MS = 3000;
/**
 * Generic short anti-spam lock for a single user-triggered action.
 *
 * It does NOT perform API calls, update cache, show toasts, or navigate. It
 * only prevents the user from immediately triggering the same action again
 * after a successful one.
 *
 * Returns:
 *  - `isCooldownActive`: whether the cooldown is currently running.
 *  - `startCooldown`: call it after a successful action to begin the lock.
 *
 * The timer is cancelled automatically on unmount, so navigating away during
 * the cooldown cannot cause any side effects.
 */
export function useCooldown(cooldownMs = ACTION_COOLDOWN_MS) {
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startCooldown = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsCooldownActive(true);

    timerRef.current = setTimeout(() => {
      setIsCooldownActive(false);
      timerRef.current = null;
    }, cooldownMs);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { isCooldownActive, startCooldown };
}

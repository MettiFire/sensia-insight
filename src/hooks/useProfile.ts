import { useCallback, useEffect, useState } from "react";
import type { UserProfile } from "@/types/sensia";

const STORAGE_KEY = "sensia.profile";

export function useProfile() {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfileState(JSON.parse(raw) as UserProfile);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  const setProfile = useCallback((p: UserProfile) => {
    setProfileState(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfileState(null);
  }, []);

  return { profile, setProfile, reset, loaded };
}

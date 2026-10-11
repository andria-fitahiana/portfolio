import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import type { Profile } from "../types/profile";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile(
            Object.fromEntries(
              Object.entries(data).map(([k, v]) => [k, v ?? ""])
            ) as unknown as Profile
          );
        }
      });
  }, []);

  return profile;
}
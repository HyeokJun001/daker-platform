"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Submission } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";

interface SubmissionState {
  submissions: Submission[];
  setSubmissions: (s: Submission[]) => void;
  addSubmission: (s: Submission) => void;
  updateSubmission: (id: string, updates: Partial<Submission>) => void;
  getByHackathon: (slug: string) => Submission[];
}

export const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set, get) => ({
      submissions: [],
      setSubmissions: (submissions) => set({ submissions }),
      addSubmission: (submission) =>
        set((state) => ({ submissions: [...state.submissions, submission] })),
      updateSubmission: (id, updates) =>
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      getByHackathon: (slug) =>
        get().submissions.filter((s) => s.hackathonSlug === slug),
    }),
    {
      name: STORAGE_KEYS.SUBMISSIONS + "_store",
    }
  )
);

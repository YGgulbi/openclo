'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile, Experience, AnalysisResult } from './types';

interface AppStore {
    profile: UserProfile | null;
    experiences: Experience[];
    analysisResult: AnalysisResult | null;
    isHydrated: boolean;

    setProfile: (profile: UserProfile) => void;
    addExperience: (experience: Experience) => void;
    updateExperience: (id: string, experience: Partial<Experience>) => void;
    removeExperience: (id: string) => void;
    setAnalysisResult: (result: AnalysisResult) => void;
    toggleActionPlan: (planId: string) => void;
    resetAll: () => void;
    setHydrated: () => void;
}

export const useAppStore = create<AppStore>()(
    persist(
        (set) => ({
            profile: null,
            experiences: [],
            analysisResult: null,
            isHydrated: false,

            setProfile: (profile) => set({ profile }),

            addExperience: (experience) =>
                set((state) => ({
                    experiences: [...state.experiences, experience],
                })),

            updateExperience: (id, updated) =>
                set((state) => ({
                    experiences: state.experiences.map((exp) =>
                        exp.id === id ? { ...exp, ...updated } : exp
                    ),
                })),

            removeExperience: (id) =>
                set((state) => ({
                    experiences: state.experiences.filter((exp) => exp.id !== id),
                })),

            setAnalysisResult: (result) => set({ analysisResult: result }),

            toggleActionPlan: (planId) =>
                set((state) => {
                    if (!state.analysisResult) return state;
                    return {
                        analysisResult: {
                            ...state.analysisResult,
                            actionPlans: state.analysisResult.actionPlans.map((plan) =>
                                plan.id === planId
                                    ? { ...plan, completed: !plan.completed }
                                    : plan
                            ),
                        },
                    };
                }),

            resetAll: () =>
                set({
                    profile: null,
                    experiences: [],
                    analysisResult: null,
                }),

            setHydrated: () => set({ isHydrated: true }),
        }),
        {
            name: 'openclo-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) state.setHydrated();
            },
        }
    )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
    isOnline: boolean;
    language: 'en' | 'ta' | 'hi';
    darkMode: boolean;
    autoOnline: boolean;
    setOnline: (status: boolean) => void;
    toggleOnline: () => void;
    setLanguage: (lang: 'en' | 'ta' | 'hi') => void;
    toggleDarkMode: () => void;
    setAutoOnline: (status: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            isOnline: false,
            language: 'en', // Default fallback
            darkMode: false,
            autoOnline: false,
            setOnline: (status) => set({ isOnline: status }),
            toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),
            setLanguage: (lang) => set({ language: lang }),
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
            setAutoOnline: (status) => set({ autoOnline: status }),
        }),
        {
            name: "app-storage", // unique name
        }
    )
);

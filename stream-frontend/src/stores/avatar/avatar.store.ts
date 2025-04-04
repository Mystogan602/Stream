import { create } from 'zustand';

interface AvatarStore {
    version: number;
    incrementVersion: () => void;
}

export const useAvatarStore = create<AvatarStore>((set) => ({
    version: 1,
    incrementVersion: () => set((state) => ({ version: state.version + 1 }))
}));
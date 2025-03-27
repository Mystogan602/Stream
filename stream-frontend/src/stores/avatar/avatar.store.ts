import { create } from 'zustand';

interface AvatarStore {
    timestamp: number;
    updateTimestamp: () => void;
}

export const useAvatarStore = create<AvatarStore>((set) => ({
    timestamp: 0,
    updateTimestamp: () => set({ timestamp: Date.now() })
}));
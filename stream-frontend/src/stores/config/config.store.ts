import { create } from 'zustand'; // 822 (gzipped: 466)
import { createJSONStorage, persist } from 'zustand/middleware'; // 2.2k
import type { TypeBaseColor } from '@/libs/constants/colors.constant';
import type { ConfigStore } from './config.types';

export const configStore = create(
    persist<ConfigStore>(
        (set) => ({
            theme: 'turquoise',
            setTheme: (theme: TypeBaseColor) => set({ theme })
        }),
        {
            name: 'config',
            storage: createJSONStorage(() => localStorage)
        }
    )
);
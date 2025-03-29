import { configStore } from '@/stores/config/config.store';

export function useConfig() {
    const theme = configStore(state => state.theme);
    const setTheme = configStore(state => state.setTheme);

    return {
        theme,
        setTheme
    };
}

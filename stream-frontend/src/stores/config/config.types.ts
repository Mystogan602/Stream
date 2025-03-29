import type { TypeBaseColor } from '@/libs/constants/colors.constant';

export interface ConfigStore {
    theme: TypeBaseColor;
    setTheme: (theme: TypeBaseColor) => void;
}
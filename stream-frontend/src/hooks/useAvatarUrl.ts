'use client';

import { useAvatarStore } from '@/stores/avatar/avatar.store';
import { useMemo } from 'react';
import { getMediaSource } from '@/utils/get-media-source';

/**
 * Hook custom to create avatar url with version
 * @param url URL source
 * @returns URL avatar with version to avoid cache
 */
export function useAvatarUrl(url: string | null | undefined) {
    const version = useAvatarStore(state => state.version);

    return useMemo(() => {
        if (!url) return undefined;
        const mediaUrl = getMediaSource(url);
        return `${mediaUrl}?v=${version}`;
    }, [url, version]);
}

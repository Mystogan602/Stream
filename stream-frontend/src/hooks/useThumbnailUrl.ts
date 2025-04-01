'use client';

import { useThumbnailStore } from '@/stores/thumbnail/thumbnail.store';
import { useMemo } from 'react';
import { getMediaSource } from '@/utils/get-media-source';

/**
 * Hook custom to create thumbnail url with version
 * @param url URL of thumbnail
 * @returns URL thumbnail with version to avoid cache
 */
export function useThumbnailUrl(url: string | null | undefined) {
    const version = useThumbnailStore(state => state.version);

    return useMemo(() => {
        if (!url) return null;
        const mediaUrl = getMediaSource(url);
        return `${mediaUrl}?v=${version}`;
    }, [url, version]);
}

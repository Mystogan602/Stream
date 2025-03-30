import { MEDIA_URL } from '@/libs/constants/url.constant';

export function getMediaSource(path: string | null | undefined) {
	return path ? `${MEDIA_URL}${path}` : null;
}

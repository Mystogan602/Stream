'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/common/Card';
import { ChannelAvatar } from '@/components/ui/elements/ChannelAvatar';
import { LiveBadge } from '@/components/ui/elements/LiveBadge';

import type { FindProfileQuery } from '@/graphql/generated/output';

import { useThumbnailUrl } from '@/hooks/useThumbnailUrl';

import { getRandomColor } from '@/utils/color';

interface StreamThumbnailProps {
	url: string | null | undefined;
	user: Pick<
		FindProfileQuery['findProfile'],
		'username' | 'avatar' | 'isVerified'
	>;
	isLive?: boolean;
}

export function StreamThumbnail({ url, user, isLive }: StreamThumbnailProps) {
	const [randomColor, setRandomColor] = useState('');
	const thumbnailUrl = useThumbnailUrl(url);

	useEffect(() => {
		setRandomColor(getRandomColor());
	}, []);

	return (
		<div className='group relative aspect-video cursor-pointer rounded-xl'>
			<div
				className='absolute inset-0 flex items-center justify-center rounded-xl opacity-0 transition-opacity group-hover:opacity-100'
				style={{
					backgroundColor: randomColor
				}}
			/>
			{url ? (
				<Image
					src={thumbnailUrl as string}
					alt={user.username}
					fill
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					className='rounded-xl object-cover transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2'
				/>
			) : (
				<Card className='flex h-full w-full flex-col items-center justify-center gap-y-4 rounded-xl transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2'>
					<ChannelAvatar channel={user} isLive={isLive} />
				</Card>
			)}
			{isLive && (
				<div className='absolute right-2 top-2 transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2'>
					<LiveBadge />
				</div>
			)}
		</div>
	);
}

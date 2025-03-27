import { useAvatarStore } from '@/stores/avatar/avatar.store';
import { type VariantProps, cva } from 'class-variance-authority';
import { useMemo } from 'react';

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/components/ui/common/Avatar';

import { FindProfileQuery } from '@/graphql/generated/output';

import { getMediaSource } from '@/utils/get-media-source';
import { cn } from '@/utils/tw-merge';

const avatarSizes = cva('', {
	variants: {
		size: {
			sm: 'size-7',
			default: 'size-9',
			lg: 'size-14',
			xl: 'size-32'
		}
	},
	defaultVariants: {
		size: 'default'
	}
});

interface ChannelAvatarProps extends VariantProps<typeof avatarSizes> {
	channel: Pick<FindProfileQuery['findProfile'], 'username' | 'avatar'>;
	isLive?: boolean;
}

export function ChannelAvatar({ channel, size, isLive }: ChannelAvatarProps) {
	const timestamp = useAvatarStore(state => state.timestamp);

	const avatarUrl = useMemo(() => {
		if (!channel.avatar) return undefined;
		const url = getMediaSource(channel.avatar);
		return `${url}?t=${timestamp}`;
	}, [channel.avatar, timestamp]);

	return (
		<div className='relative'>
			<Avatar
				className={cn(
					avatarSizes({ size }),
					isLive && 'ring-2 ring-rose-500'
				)}
			>
				<AvatarImage src={avatarUrl} className='object-cover' />
				<AvatarFallback className={cn(size === 'xl' && 'text-4xl')}>
					{channel.username?.[0]}
				</AvatarFallback>
			</Avatar>
		</div>
	);
}

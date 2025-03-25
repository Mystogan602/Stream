import { type VariantProps, cva } from 'class-variance-authority';

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
			lg: 'size-14'
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
	return (
		<div className='relative'>
			<Avatar
				className={cn(
					avatarSizes({ size }),
					isLive && 'ring-2 ring-rose-500'
				)}
			>
				<AvatarImage
					src={getMediaSource(channel.avatar) ?? undefined}
					className='object-cover'
				/>
				<AvatarFallback>
					{channel.username ? channel.username[0] : ''}
				</AvatarFallback>
			</Avatar>
		</div>
	);
}

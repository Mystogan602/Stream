'use client';

import { useTranslations } from 'next-intl';

import { Separator } from '@/components/ui/common/Separator';

import { useFindRecommendedChannelsQuery } from '@/graphql/generated/output';

import { useSidebar } from '@/hooks/useSidebar';

import { ChannelItem } from './ChannelItem';

export function RecommendedChannels() {
	const t = useTranslations('layout.sidebar.recommended');
	const { isCollapsed } = useSidebar();
	const { data, loading: isLoadingRecommended } =
		useFindRecommendedChannelsQuery();
	const channels = data?.findRecommendedChannels ?? [];

	return (
		<div>
			<Separator className='mb-3' />
			{!isCollapsed && (
				<h2 className='mb-2 px-2 text-lg font-semibold text-foreground'>
					{t('heading')}
				</h2>
			)}
			{isLoadingRecommended ? (
				<div>Loading...</div>
			) : (
				channels.map((channel, index) => (
					<ChannelItem key={index} channel={channel} />
				))
			)}
		</div>
	);
}

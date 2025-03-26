'use client';

import { ChannelAvatar } from '@/components/ui/elements/ChannelAvatar';

import { useCurrent } from '@/hooks/useCurrent';

export default function Home() {
	const { user, isLoadingProfile } = useCurrent();

	return (
		<div>
			{isLoadingProfile ? (
				'Loading...'
			) : (
				<div>
					{JSON.stringify(user)}
					{/* <ChannelAvatar
						channel={{
							username: user?.username!,
							avatar: user?.avatar!
						}}
					/> */}
				</div>
			)}
		</div>
	);
}

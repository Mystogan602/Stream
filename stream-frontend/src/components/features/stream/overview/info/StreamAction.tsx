import type { FindChannelByUsernameQuery } from '@/graphql/generated/output';

import { FollowButton } from './FollowButton';
import { SupportButton } from './SupportButton';

interface StreamActionsProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

export function StreamActions({ channel }: StreamActionsProps) {
	return (
		<div className='mt-5 items-center space-x-3 space-y-4 lg:mt-0 lg:flex lg:space-y-0'>
			<FollowButton channel={channel} />
			{channel.isVerified &&
				channel.sponsorshipPlan &&
				channel.sponsorshipPlan.length > 0 && (
					<SupportButton channel={channel} />
				)}
		</div>
	);
}

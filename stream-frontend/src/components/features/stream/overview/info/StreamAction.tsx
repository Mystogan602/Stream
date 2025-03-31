import type { FindChannelByUsernameQuery } from '@/graphql/generated/output';

interface StreamActionsProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

export function StreamActions({ channel }: StreamActionsProps) {
	return <div>StreamActions</div>;
}

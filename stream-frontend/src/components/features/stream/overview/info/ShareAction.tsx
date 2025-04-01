import { Share } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FaFacebook, FaTelegram } from 'react-icons/fa';
import { FaThreads, FaTwitter } from 'react-icons/fa6';
import {
	FacebookShareButton,
	TelegramShareButton,
	ThreadsShareButton,
	TwitterShareButton
} from 'react-share';

import { Button } from '@/components/ui/common/Button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/common/Popover';

import type { FindChannelByUsernameQuery } from '@/graphql/generated/output';

interface ShareActionsProps {
	channel: FindChannelByUsernameQuery['findChannelByUsername'];
}

export function ShareActions({ channel }: ShareActionsProps) {
	const t = useTranslations('stream.actions.share');

	const shareUrl = `${window.location.origin}/${channel.username}`;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='ghost' size='lgIcon'>
					<Share className='size-5' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[300px]' side='top'>
				<h2 className='font-medium'>{t('heading')}</h2>
				<div className='mt-4 grid grid-cols-4 gap-3'>
					<TelegramShareButton url={shareUrl}>
						<div className='flex h-14 items-center justify-center rounded-md bg-sky-500 transition-transform hover:-translate-y-1.5'>
							<FaTelegram className='size-7 text-white' />
						</div>
					</TelegramShareButton>
					<FacebookShareButton url={shareUrl}>
						<div className='flex h-14 items-center justify-center rounded-md bg-sky-600 transition-transform hover:-translate-y-1.5'>
							<FaFacebook className='size-7 text-white' />
						</div>
					</FacebookShareButton>
					<TwitterShareButton url={shareUrl}>
						<div className='flex h-14 items-center justify-center rounded-md bg-black transition-transform hover:-translate-y-1.5'>
							<FaTwitter className='size-7 text-white' />
						</div>
					</TwitterShareButton>
					<ThreadsShareButton url={shareUrl}>
						<div className='flex h-14 items-center justify-center rounded-md bg-black transition-transform hover:-translate-y-1.5'>
							<FaThreads className='size-7 text-white' />
						</div>
					</ThreadsShareButton>
				</div>
			</PopoverContent>
		</Popover>
	);
}

import type { PropsWithChildren } from 'react';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/common/Tooltip';

interface HintProps {
	label: string;
	asChild?: boolean;
	side?: 'top' | 'bottom' | 'left' | 'right';
	align?: 'start' | 'center' | 'end';
}

export function Hint({
	label,
	asChild,
	align,
	side,
	children
}: PropsWithChildren<HintProps>) {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
				<TooltipContent
					className='bg-[#1f2128] text-white dark:bg-white dark:text-[#1f2128]'
					side={side}
					align={align}
				>
					<p className='font-semibold'>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

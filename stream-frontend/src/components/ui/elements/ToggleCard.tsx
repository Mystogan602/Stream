import { PropsWithChildren } from 'react';

import { Switch } from '../common/Switch';

import { CardContainer } from './CardContainer';
import { Skeleton } from '../common/Skeleton';

interface ToggleCardProps {
	heading: string;
	description: string;
	isDisabled?: boolean;
	value: boolean;
	onChange: (value: boolean) => void;
}

export function ToggleCard({
	children,
	heading,
	description,
	isDisabled,
	value,
	onChange
}: PropsWithChildren<ToggleCardProps>) {
	return (
		<CardContainer
			heading={heading}
			description={description}
			rightContent={
				<Switch
					checked={value}
					onCheckedChange={onChange}
					disabled={isDisabled}
				/>
			}
		>
			{children}
		</CardContainer>
	);
}

export function ToggleCardSkeleton() {
	return <Skeleton className='mt-6 h-20 w-full' />;
}

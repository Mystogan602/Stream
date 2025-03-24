import Image from 'next/image';
import Link from 'next/link';
import { type PropsWithChildren } from 'react';

import { Button } from '@/components/ui/common/Button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/common/Card';

interface AuthWrapperProps {
	header: string;
	backButtonLabel?: string;
	backButtonHref?: string;
}
export function AuthWrapper({
	children,
	header,
	backButtonLabel,
	backButtonHref
}: PropsWithChildren<AuthWrapperProps>) {
	return (
		<div className='flex h-full items-center justify-center'>
			<Card className='w-[450px]'>
				<CardHeader className='flex-row items-center justify-center gap-x-4'>
					<Image
						src='/images/logo.svg'
						alt='TeaStream'
						width={40}
						height={40}
					/>
					<CardTitle>{header}</CardTitle>
				</CardHeader>
				<CardContent>{children}</CardContent>
				<CardFooter className='-mt-2'>
					{backButtonLabel && backButtonHref && (
						<Button variant='ghost' className='w-full'>
							<Link href={backButtonHref}>{backButtonLabel}</Link>
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}

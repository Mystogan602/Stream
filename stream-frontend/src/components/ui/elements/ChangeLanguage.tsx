/**
 * v0 by Vercel.
 * @see https://v0.dev/t/mzEaILoLjkS
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client';

import { GlobeIcon } from 'lucide-react';
import { ChevronDownIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/common/Button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/common/DropdownMenu';

import { type Language, languages } from '@/libs/i18n/config';
import { setLanguage } from '@/libs/i18n/language';

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/mzEaILoLjkS
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

export function ChangeLanguage() {
	const router = useRouter();
	const currentLocale = useLocale();

	const handleLanguageChange = async (locale: string) => {
		// Lưu ngôn ngữ vào cookie thông qua server action
		await setLanguage(locale as Language);

		// Refresh để áp dụng ngôn ngữ mới
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='flex items-center gap-2'>
					<GlobeIcon className='h-4 w-4' />
					<span>
						{currentLocale === 'vi' ? 'Tiếng Việt' : 'English'}
					</span>
					<ChevronDownIcon className='h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-[180px]'>
				<DropdownMenuLabel>Select Language</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={currentLocale}
					onValueChange={handleLanguageChange}
				>
					<DropdownMenuRadioItem value='en'>
						English
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value='vi'>
						Tiếng Việt
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
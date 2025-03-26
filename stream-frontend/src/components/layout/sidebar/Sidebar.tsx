'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { SidebarHeader } from './SidebarHeader';

import { cn } from '@/utils/tw-merge';

export function Sidebar() {
	const { isCollapsed } = useSidebar();

	return (
		<aside
			className={cn(
				'fixed left-0 z-50 mt-[75px] flex h-full flex-col border-r border-border bg-card transition-all duration-100 ease-in-out',
				isCollapsed ? 'w-16' : 'w-64'
			)}
		>
			<SidebarHeader />
		</aside>
	);
}

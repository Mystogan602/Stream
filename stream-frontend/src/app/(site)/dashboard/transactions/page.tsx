import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { TransactionsTable } from '@/components/features/sponsorship/transaction/table/TransactionsTable';

import { NO_INDEX_PAGE } from '@/libs/constants/seo.constant';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('dashboard.transactions.header');

	return {
		title: t('heading'),
		description: t('description'),
		...NO_INDEX_PAGE
	};
}

export default function TransactionsPage() {
	return <TransactionsTable />;
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { DeactivateForm } from '@/components/features/auth/forms/DeactivateForm';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('auth.deactivate');

	return {
		title: t('heading')
	};
}

export default function DeactivatePage() {
	return <DeactivateForm />;
}

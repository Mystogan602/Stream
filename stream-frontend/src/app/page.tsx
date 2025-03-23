'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/common/Button';
export default function Home() {
  const t = useTranslations('home');

  return <div className='flex flex-col items-center justify-center h-screen'>
    <h1 className='text-4xl font-bold'>{t('title')}</h1>
    <Button>Click me</Button>
    <Button variant='outline'>Click me</Button>
    <Button variant='secondary'>Click me</Button>
    <Button variant='ghost'>Click me</Button>
  </div>;
}

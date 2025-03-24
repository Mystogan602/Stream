'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useVerifyAccountMutation } from '@/graphql/generated/output'
import { useEffect } from 'react'
import { AuthWrapper } from '../AuthWrapper'
import { Loader } from 'lucide-react'

export function VerifyAccountForm() {
    const t = useTranslations('auth.verify')
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token') ?? null

    const [verify] = useVerifyAccountMutation({
        onCompleted() {
            toast.success(t('successMessage'))
            router.push('/dashboard/settings')
        },
        onError() {
            toast.error(t('errorMessage'))
        }
    })

    useEffect(() => {
        if (token) {
            verify({
                variables: {
                    data: { token }
                }
            })
        }
    }, [token])

    return (
        <AuthWrapper heading={t('heading')}>
            <div className="flex justify-center">
                <Loader className="size-8 animate-spin" />
            </div>
        </AuthWrapper>
    )
}
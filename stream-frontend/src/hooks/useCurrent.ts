import { useClearSessionCookiesMutation, useFindProfileQuery } from '@/graphql/generated/output'
import { useAuth } from './useAuth'
import { useEffect } from 'react'

export function useCurrent() {
    const { isAuthenticated, exit } = useAuth()
    const { data, loading, refetch, error } = useFindProfileQuery({
        skip: !isAuthenticated
    })

    const [clear] = useClearSessionCookiesMutation()

    useEffect(() => {
        if (error) {
            if (isAuthenticated) {
                clear()
            }
            exit()
        }
    }, [isAuthenticated, clear, exit])

    return {
        user: data?.findProfile,
        isLoadingProfile: loading,
        refetch
    }
}
'use client'

import { useCallback } from 'react'
import useSWR from 'swr'

import { fetcher } from '../../utils/fetcher'

// useApi hook for GET, POST and DELETE requests through swr
export function useApi<T>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher)

  const mutateApi = useCallback(async (
    mutationUrl: string,
    options?: {
      method?: 'POST' | 'DELETE'
      body?: Record<string, unknown>
    }
  ) => {
    const { method = 'POST', body } = options || {}
    
    const bodyString = body ? JSON.stringify(body) : undefined
    const result = await fetcher(mutationUrl, {
      method,
      body: bodyString,
    })

    return result
  }, [])

  return {
    data,
    error,
    isLoading,
    mutate,
    mutateApi,
  }
}

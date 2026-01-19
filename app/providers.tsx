'use client'

// Provider component to use SWR and Username Context

import { SWRConfig } from 'swr'

import { fetcher } from './utils/fetcher'
import { UsernameProvider } from './lib/contexts/UsernameContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        dedupingInterval: 2000,
      }}
    >
      <UsernameProvider>
        {children}
      </UsernameProvider>
    </SWRConfig>
  )
}

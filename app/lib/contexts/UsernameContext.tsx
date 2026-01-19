'use client'

import { createContext, useContext, useState, useEffect, useEffectEvent, ReactNode } from 'react'

const USERNAME_KEY = 'catopia_username'

interface UsernameContextType {
  username: string | null
  setUsername: (username: string) => void
  clearUsername: () => void
  isLoading: boolean
}

const UsernameContext = createContext<UsernameContextType | undefined>(undefined)

export function UsernameProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const updateUsername = useEffectEvent((stored: string | null) => {
    setUsernameState((current) => {
      // Only update if the stored value is different from current state
      // Otherwise we get rerenders when navigating 
      if (stored !== current) {
        return stored
      }
      return current
    })
  })

  const updateIsLoading = useEffectEvent((isLoading: boolean) => {
    setIsLoading(isLoading)
  })

  // Only read from sessionStorage after component mounts 
  // This prevents hydration errors by using useEffectEvents 
  useEffect(() => {
    const stored = sessionStorage.getItem(USERNAME_KEY)
    updateUsername(stored)
    updateIsLoading(false)
  }, [])

  // Set a username in session Storage
  const setUsername = (newUsername: string) => {
    if (newUsername.trim()) {
      const trimmed = newUsername.trim()
      sessionStorage.setItem(USERNAME_KEY, trimmed)
      setUsernameState(trimmed)
    }
  }

  // Clear a username from session Storage
  const clearUsername = () => {
    sessionStorage.removeItem(USERNAME_KEY)
    setUsernameState(null)
  }

  return (
    <UsernameContext.Provider
      value={{
        username,
        setUsername,
        clearUsername,
        isLoading,
      }}
    >
      {children}
    </UsernameContext.Provider>
  )
}

export function useUsername() {
  const context = useContext(UsernameContext)
  if (context === undefined) {
    throw new Error('useUsername must be used within a UsernameProvider')
  }
  return context
}

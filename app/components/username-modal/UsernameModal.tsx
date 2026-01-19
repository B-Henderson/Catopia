'use client'

import { useState, useEffect } from 'react'

import { useUsername } from '../../lib/hooks/useUsername'

interface UsernameModalProps {
  onUsernameChange?: () => void
  mutateLikes?: (data?: any, options?: { revalidate?: boolean }) => Promise<any>
  mutateFavourites?: (data?: any, options?: { revalidate?: boolean }) => Promise<any>
}

export function UsernameModal({ onUsernameChange, mutateLikes, mutateFavourites }: UsernameModalProps) {
  const { username, setUsername, isLoading } = useUsername()
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !username) {
      setIsOpen(true)
    } else if (username) {
      setIsOpen(false)
    }
  }, [username, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const newUsername = inputValue.trim()
      const usernameChanged = newUsername !== username
      setUsername(newUsername)
      setIsOpen(false)
      setInputValue('')
      // Trigger callback after state update using setTimeout to ensure state has updated
      if (usernameChanged) {
        // Use setTimeout to ensure username state has updated before revalidating
        setTimeout(() => {
          if (mutateLikes) {
            mutateLikes(undefined, { revalidate: true })
          }
          if (mutateFavourites) {
            mutateFavourites(undefined, { revalidate: true })
          }
          onUsernameChange?.()
        }, 0)
      }
    }
  }

  const handleChange = () => {
    setIsOpen(true)
    setInputValue(username || '')
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          User: <span className="font-semibold text-gray-900 dark:text-gray-100">{username}</span>
        </span>
        <button
          onClick={handleChange}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Change
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Set Your Username
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Choose a username to identify your votes and uploads. This will be stored in your browser session.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
              bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            autoFocus
            required
            minLength={1}
            maxLength={50}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg
                hover:bg-blue-700 transition-colors duration-200
                dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Save Username
            </button>
            {username && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                  text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800
                  transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

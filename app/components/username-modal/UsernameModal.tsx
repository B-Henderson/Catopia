'use client'

import { useState, useEffect } from 'react'

import { useUsername } from '@/app/lib/hooks/useUsername'

export function UsernameModal() {
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
      setUsername(inputValue.trim())
      setIsOpen(false)
      setInputValue('')
    }
  }

  const handleChange = () => {
    setIsOpen(true)
    setInputValue(username || '')
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <></>
    )
  }

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white  rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Set Your Username
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Choose a username to identify your votes and uploads. This will be stored in your browser session.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
              bg-white text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            autoFocus
            required
            minLength={1}
            maxLength={50}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              aria-label="Save username"
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg
                hover:bg-blue-700 transition-colors duration-200"
            >
              Save Username
            </button>
            {username && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cancel"
                className="px-4 py-2 border border-gray-300 rounded-lg
                  text-gray-700 hover:bg-gray-50
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

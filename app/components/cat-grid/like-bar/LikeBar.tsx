'use client'
import { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons"

import { useApi } from '@/app/lib/hooks/useApi'
import { useUsername } from '@/app/lib/hooks/useUsername'

import { LikeBarProps } from './LikeBar.interface'


export function LikeBar({ imageId, currentVote, onVoteChange }: LikeBarProps) {
  const { username } = useUsername()
  const { mutateApi: vote } = useApi(null)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (value: 1 | -1 | 0) => {
    if (!username) {
      alert('Please set a username first')
      return
    }

    setIsVoting(true)

    try {
      await vote('/api/user-felines/likes', {
        method: 'POST',
        body: {
          image_id: imageId,
          vote_id: currentVote?.id || null,
          value: value, 
          sub_id: username,
        },
      })
      onVoteChange?.()
    } catch (error) {
      console.error('Failed to vote:', error)
    } finally {
      setIsVoting(false)
    }
  }

  if (!username) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Set username to vote
      </div>
    )
  }

  return (
    <div className="flex gap-2 justify-between">
      <button
        onClick={() => handleVote(currentVote?.value === 1 ? 0 : 1)}
        disabled={isVoting}
        aria-label="Vote up"
        className={`px-10 py-1 rounded text-sm transition-colors hover:cursor-pointer ${
          currentVote?.value === 1
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-600 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600`}
      >
        <FontAwesomeIcon icon={faThumbsUp} />
      </button>
      <button
        onClick={() => handleVote(currentVote?.value === -1 ? 0 : -1)}
        disabled={isVoting}
        aria-label="Vote down"
        className={`px-10 py-1 rounded text-sm transition-colors hover:cursor-pointer ${
          currentVote?.value === -1
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-gray-600 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600`}
      >
        <FontAwesomeIcon icon={faThumbsDown} />
      </button>
    </div>
  )
}

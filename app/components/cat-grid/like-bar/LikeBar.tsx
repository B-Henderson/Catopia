'use client'
import { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons"

import { useApi } from '@/app/lib/hooks/useApi'
import { useUsername } from '@/app/lib/hooks/useUsername'

import { LikeBarProps } from './LikeBar.interface'


export function LikeBar({ imageId, currentVote, onVoteChange, likesCount = 0, dislikesCount = 0, totalCount = 0, totalScore = 0 }: LikeBarProps) {
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
      <div className="text-xs text-gray-500">
        Set username to vote
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-between items-center">
        <button
          onClick={() => handleVote(currentVote?.value === 1 ? 0 : 1)}
          disabled={isVoting}
          aria-label="Vote up"
          className={`2xl:px-14 2xl:py-4 xl:px-10 xl:py-4 lg:px-6 lg:py-4 md:px-14 md:py-4 sm:px-16 sm:py-4 px-10 py-4 rounded text-sm transition-colors hover:cursor-pointer ${
            currentVote?.value === 1
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600`}
        >
          <FontAwesomeIcon icon={faThumbsUp} size="xl" />
        </button>
        <div className={`text-lg font-semibold px-2 ${totalScore > 0 ? 'text-green-600' : totalScore < 0 ? 'text-red-600' : 'text-gray-600'}`}>
          {totalScore > 0 ? '+' : ''}{totalScore}
        </div>
        <button
          onClick={() => handleVote(currentVote?.value === -1 ? 0 : -1)}
          disabled={isVoting}
          aria-label="Vote down"
          className={`2xl:px-14 2xl:py-4 xl:px-10 xl:py-4 lg:px-6 lg:py-4 md:px-14 md:py-4 sm:px-16 sm:py-4 px-10 py-4  rounded text-sm transition-colors hover:cursor-pointer ${
            currentVote?.value === -1
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600`}
        >
          <FontAwesomeIcon icon={faThumbsDown} size="xl" />
        </button>
      </div>
      <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
        <FontAwesomeIcon icon={faThumbsUp} className="text-green-500" /> {likesCount} | <FontAwesomeIcon icon={faThumbsDown} className="text-red-500" /> {dislikesCount} ({totalCount} total)
      </div>
    </div>
  )
}

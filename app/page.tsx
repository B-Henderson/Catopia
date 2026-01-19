'use client'

import { useCallback, useEffect, useRef } from 'react'

import { useApi } from './lib/hooks/useApi'
import { CatGrid } from './components/cat-grid/CatGrid'
import { UsernameModal } from './components/username-modal/UsernameModal'
import { useUsername } from './lib/hooks/useUsername'

import { CatsApiResponse, LikesApiResponse, FavouritesApiResponse } from './types'

export default function Home() {
  const { username } = useUsername()
  
  const { data: cats, isLoading, error, mutate: mutateCats } =
    useApi<CatsApiResponse>('/api/user-felines')
  
  const { data: likes, mutate: mutateLikes } =
    useApi<LikesApiResponse>('/api/user-felines/likes')
  
  const { data: favourites, mutate: mutateFavourites } =
    useApi<FavouritesApiResponse>('/api/user-felines/favourites')

  const handleUsernameChange = useCallback(() => {
    // Likes and Favourites aren't being revalidated on username change
    // so force a revalidation
    mutateCats(undefined, { revalidate: true })
    mutateLikes(undefined, { revalidate: true })
    mutateFavourites(undefined, { revalidate: true })
  }, [mutateCats, mutateLikes, mutateFavourites])

  // Track previous username to detect actual changes
  const prevUsernameRef = useRef<string | null>(null)

  // Watch for username changes and trigger revalidation only when it actually changes
  useEffect(() => {
    if (prevUsernameRef.current === null) {
      prevUsernameRef.current = username
      return
    }

    // Only revalidate if username actually changed
    if (prevUsernameRef.current !== username && username) {
      mutateCats(undefined, { revalidate: true })
      mutateLikes(undefined, { revalidate: true })
      mutateFavourites(undefined, { revalidate: true })
      prevUsernameRef.current = username
    } else if (prevUsernameRef.current !== username) {
      // Username was cleared
      prevUsernameRef.current = username
    }
  }, [username, mutateCats, mutateLikes, mutateFavourites])
  
  return (
    <div className="min-h-screen bg-gray-200 font-sans">
      <main className="container mx-auto pt-4 pb-8 px-4">
        <UsernameModal
          onUsernameChange={handleUsernameChange}
          mutateLikes={mutateLikes}
          mutateFavourites={mutateFavourites}
        />
        {isLoading ?
          <div>Loading cats...</div>
          : error
            ? <div>Error loading cats: {error.message}</div>
            : <CatGrid
              key={username || 'no-username'}
              likes={likes?.data || []}
              favourites={favourites?.data || []}
              cats={cats?.data || []}
              onVoteChange={mutateLikes}
              onFavouriteChange={mutateFavourites}
            />}
      </main>
    </div>
  )
}

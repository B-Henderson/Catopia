'use client'

import { useApi } from './lib/hooks/useApi'
import { CatGrid } from './components/cat-grid/CatGrid'
import { UsernameModal } from './components/username-modal/UsernameModal'
import { useUsername } from './lib/hooks/useUsername'

import { CatsApiResponse, LikesApiResponse, FavouritesApiResponse } from './types'

export default function Home() {
  const { username } = useUsername()
  
  // SWR automatically revalidates when username changes (conditional fetching: https://swr.vercel.app/docs/conditional-fetching)
  // When username is null, the key becomes null and SWR won't fetch (conditional fetching)
  // also prevents getting data on initial render before a username is set
  // this avoid the flashing of data behind the blur background
  const { data: cats, isLoading, error, mutate: mutateCats } =
    useApi<CatsApiResponse>(username ? ['/api/user-felines', username] : null)
  
  const { data: likes, mutate: mutateLikes } =
    useApi<LikesApiResponse>(username ? ['/api/user-felines/likes', username] : null)
  
  const { data: favourites, mutate: mutateFavourites } =
    useApi<FavouritesApiResponse>(username ? ['/api/user-felines/favourites', username] : null)
  
  return (
    <div className="min-h-screen bg-gray-200 font-sans">
      <main className="container mx-auto pt-4 pb-8 px-4">
        <UsernameModal />
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

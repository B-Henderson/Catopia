'use client'
import Image from 'next/image'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons"

import { CatGridProps } from "./CatGrid.interface"
import { LikeBar } from "./like-bar/LikeBar"
import { useUsername } from '@/app/lib/hooks/useUsername'
import { Favourite } from "./favourite-icon/Favourite"

export function CatGrid({cats, likes, onVoteChange, onFavouriteChange, favourites}: CatGridProps) {
    const { username } = useUsername()
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cats.map((cat) => {
                // Create an array of all likes that match the current cat image
                const catLikes = likes.filter((like) => like.image_id === cat.id);
                const { totalScore, likesCount, dislikesCount } = catLikes.reduce(
                    (acc, next) => ({
                        totalScore: acc.totalScore + next.value,
                        likesCount: acc.likesCount + (next.value === 1 ? 1 : 0),
                        dislikesCount: acc.dislikesCount + (next.value === -1 ? 1 : 0),
                    }),
                    { totalScore: 0, likesCount: 0, dislikesCount: 0 }
                );

                const userVote = username 
                    ? catLikes.find(like => like.sub_id.toLowerCase() === username.toLowerCase())
                    : null
                
                const userFavourite = favourites.find((favourite) => favourite.image.id === cat.id && favourite.sub_id === username);

                return (
                    <div key={cat.id} className="border relative rounded-lg p-4 bg-white dark:bg-zinc-900 min-h-[335px]">
                        <Favourite catId={cat.id} favouriteId={userFavourite?.id} onFavouriteChange={onFavouriteChange} />
                        <div className="relative w-full h-48 mb-2 rounded overflow-hidden">
                            <Image 
                                src={cat.url} 
                                alt={cat.id} 
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                fetchPriority="high" 
                                loading="eager" 
                                placeholder="blur"
                                blurDataURL={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP0ifOpBwADawF3MXO9DQAAAABJRU5ErkJggg=="}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="text-sm font-semibold">
                                        Score: <span className={totalScore >= 0 ? 'text-green-600' : 'text-red-600'}>{totalScore}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 w-full text-center">
                                        <FontAwesomeIcon icon={faThumbsUp} /> {likesCount} | <FontAwesomeIcon icon={faThumbsDown} /> {dislikesCount} ({catLikes.length} total)
                                    </div>
                                </div>
                            </div>
                            <LikeBar 
                                imageId={cat.id} 
                                currentVote={userVote ? { id: parseInt(userVote.id), value: userVote.value } : null}
                                onVoteChange={onVoteChange}
                            />
                            {<div
                                className="text-xs text-gray-600 dark:text-gray-400 text-center"
                            >
                                uploaded by {(username?.toLowerCase() === cat.sub_id?.toLowerCase() ? 'You' : cat.sub_id) || 'Anonymous'}
                            </div>}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
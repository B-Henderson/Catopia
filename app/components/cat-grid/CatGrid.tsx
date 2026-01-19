'use client'
import Image from 'next/image'

import { CatGridProps } from "./CatGrid.interface"
import { LikeBar } from "./like-bar/LikeBar"
import { useUsername } from '@/app/lib/hooks/useUsername'
import { Favourite } from "./favourite-icon/Favourite"

export function CatGrid({cats, likes, onVoteChange, onFavouriteChange, favourites}: CatGridProps) {
    const { username } = useUsername()
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cats.map((cat, index) => {
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

                const userFavourite = username
                    ? favourites.find(
                        (favourite) =>
                            favourite.image.id === cat.id &&
                            favourite.sub_id &&
                            favourite.sub_id.toLowerCase() === username.toLowerCase()
                    )
                    : null;

                return (
                    <div key={cat.id} className="relative rounded-xl p-4 bg-gray-100 min-h-[305px] shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200">
                        <Favourite
                            catId={cat.id}
                            favouriteId={userFavourite?.id}
                            onFavouriteChange={onFavouriteChange}
                        />
                        <div className="relative w-full h-64 sm:h-96 md:h-72 lg:h-48 xl:h-56 2xl:h-72 mb-2 rounded-lg overflow-hidden shadow-sm">
                            <Image 
                                src={cat.url} 
                                alt={cat.id} 
                                fill
                                className="object-cover"
                                sizes="(max-width: 767px) 100vw, (max-width: 1023px) calc(50vw - 1rem), calc(25vw - 0.75rem)"
                                preload={index === 0}
                                fetchPriority={index === 0 ? 'high' : 'auto'}
                                quality={85}
                                placeholder="blur"
                                objectFit="cover"
                                objectPosition="center"
                                blurDataURL={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP0ifOpBwADawF3MXO9DQAAAABJRU5ErkJggg=="}
                            />
                        </div>
                        <div className="flex flex-col gap-2 mt-6">
                            <LikeBar 
                                imageId={cat.id} 
                                currentVote={userVote ? { id: parseInt(userVote.id), value: userVote.value } : null}
                                onVoteChange={onVoteChange}
                                likesCount={likesCount}
                                dislikesCount={dislikesCount}
                                totalCount={catLikes.length}
                                totalScore={totalScore}
                            />
                            {<div
                                className="text-xs text-gray-600 text-center"
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
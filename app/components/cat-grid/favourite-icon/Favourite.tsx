'use client'

import { useState } from "react"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useApi } from "@/app/lib/hooks/useApi"
import { useUsername } from "@/app/lib/hooks/useUsername"

import { FavouriteProps } from "./Favourite.interface"

export function Favourite({ catId, favouriteId, onFavouriteChange }: FavouriteProps) {
    const { mutateApi } = useApi(null)
    const { username } = useUsername()
    const [isFavouriting, setIsFavouriting] = useState(false)
    
    const handleFavourite = async () => {
        setIsFavouriting(true)
        try {
            if (favouriteId) {
                await mutateApi(`/api/user-felines/favourites/${favouriteId}`, {
                    method: 'DELETE',
                })
            } else {
                await mutateApi(`/api/user-felines/favourites`, {
                    method: 'POST',
                    body: {
                        image_id: catId,
                        sub_id: username,
                    },
                })
            }
            onFavouriteChange?.()
        } finally {
            setIsFavouriting(false)
        }
    }

    return (
        <div className="absolute top-1 right-0 z-10 ">
            <button onClick={handleFavourite} aria-label="Favourite this cat">
                <FontAwesomeIcon
                    size="2x"
                    icon={faStar}
                    className={`hover:text-yellow-500 hover:cursor-pointer transition-colors duration-200
                    ${favouriteId ? 'text-yellow-500' : 'text-gray-500'}
                    ${isFavouriting ? 'animate-pulse' : ''}
                    `}                    
                />
            </button>
        </div>
    )
}
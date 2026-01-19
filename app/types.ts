// global types for the application

/**
 * Base API response interface
 * all endpoints return a message and data
 * @message string
 * @data T
 */
export interface ApiResponse<T> {
  message: string
  data: T
}

// Data type interfaces
export interface Cat {
  id: string
  url: string
  sub_id: string
}

export interface Like {
  id: string
  image_id: string
  value: number
  sub_id: string
}

export interface Favourite {
  id: number
  image_id: string
  sub_id: string
  image: {
    id: string
    url: string
  }
}

/**
 * Extended API response interfaces
 * @CatsApiResponse Cats API response
 * @LikesApiResponse Likes API response
 * @FavouritesApiResponse Favourites API response
 */
export type CatsApiResponse = ApiResponse<Cat[]>;
export type LikesApiResponse = ApiResponse<Like[]>;
export type FavouritesApiResponse = ApiResponse<Favourite[]>;

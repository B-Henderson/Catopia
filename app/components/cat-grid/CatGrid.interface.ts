export interface CatGridProps {
    cats: {
        id: string
        url: string
        sub_id: string
        favourite?: {
            id: number;
        }
    }[];
    likes: {
        id: string
        image_id: string
        value: number
        sub_id: string
    }[];
    favourites: {
        id: number;
        sub_id: string;
        image: {
            id: string;
            url: string;
        }
    }[];
    onVoteChange?: () => void;
    onFavouriteChange?: () => void;
    isLoadingFavourites?: boolean;
}
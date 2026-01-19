export interface LikeBarProps {
    imageId: string
    currentVote?: { id: number; value: number } | null
    onVoteChange?: () => void
  }
  
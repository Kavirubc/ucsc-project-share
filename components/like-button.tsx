'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

interface LikeButtonProps {
  projectId: string
  initialLikesCount: number
  initialIsLiked?: boolean
}

export function LikeButton({
  projectId,
  initialLikesCount,
  initialIsLiked = false,
}: LikeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch initial like status if not provided (fallback for client-side navigation)
  useEffect(() => {
    if (session?.user) {
      // Only fetch if initialIsLiked was not explicitly provided (undefined, not false)
      // Since we pass it from server, this is mainly for client-side navigation
      const fetchLikeStatus = async () => {
        try {
          const response = await fetch(`/api/projects/${projectId}/like`)
          if (response.ok) {
            const data = await response.json()
            setIsLiked(data.isLiked)
            setLikesCount(data.likesCount)
          }
        } catch (error) {
          console.error('Error fetching like status:', error)
        }
      }
      
      // Only fetch if we don't have initial state (for client-side navigation)
      if (initialIsLiked === undefined) {
        fetchLikeStatus()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, projectId])

  const handleToggleLike = async () => {
    if (!session?.user) {
      return
    }

    setIsLoading(true)
    const previousLiked = isLiked
    const previousCount = likesCount

    // Optimistic update
    setIsLiked(!previousLiked)
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1)

    try {
      const method = previousLiked ? 'DELETE' : 'POST'
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method,
      })

      if (!response.ok) {
        // Revert on error
        setIsLiked(previousLiked)
        setLikesCount(previousCount)
        throw new Error('Failed to toggle like')
      }

      const data = await response.json()
      setIsLiked(data.liked)
      setLikesCount(data.likesCount)
      router.refresh()
    } catch (error) {
      console.error('Error toggling like:', error)
      // Revert on error
      setIsLiked(previousLiked)
      setLikesCount(previousCount)
    } finally {
      setIsLoading(false)
    }
  }

  // Only show for authenticated users
  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Heart className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{likesCount}</span>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleToggleLike}
      disabled={isLoading}
    >
      {isLiked ? (
        <Heart className="h-4 w-4 mr-2 fill-red-500 text-red-500" />
      ) : (
        <Heart className="h-4 w-4 mr-2" />
      )}
      {isLiked ? 'Liked' : 'Like'} ({likesCount})
    </Button>
  )
}


'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check } from 'lucide-react'

interface ShareButtonProps {
  projectId: string
  projectTitle: string
}

export function ShareButton({ projectId, projectTitle }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const getProjectUrl = () => {
    // Get base URL from environment or window location
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '')
    return `${baseUrl}/projects/${projectId}`
  }

  const handleShare = async () => {
    const url = getProjectUrl()

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback: try using the Share API if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: projectTitle,
            text: `Check out this project: ${projectTitle}`,
            url: url,
          })
        } catch (shareError) {
          console.error('Failed to share:', shareError)
        }
      }
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleShare}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </>
      )}
    </Button>
  )
}


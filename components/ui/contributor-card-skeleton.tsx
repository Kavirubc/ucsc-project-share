import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ContributorCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar Skeleton */}
          <Skeleton className="w-24 h-24 rounded-full" />

          {/* Name and Badge Skeleton */}
          <div className="space-y-3 w-full flex flex-col items-center">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* View Profile Button Skeleton */}
          <div className="w-full mt-2">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

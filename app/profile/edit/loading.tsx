import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function EditProfileLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        <div className="space-y-6 max-w-3xl">
          {/* Card 1: Profile Picture & Bio */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" /> {/* Label: Profile Picture */}
                <div className="flex items-center gap-6">
                  <Skeleton className="h-24 w-24 rounded-full" /> {/* Avatar */}
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-10 w-32" /> {/* Upload Button */}
                    <Skeleton className="h-3 w-48" /> {/* Helper text */}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-8" /> {/* Label: Bio */}
                <Skeleton className="h-32 w-full" /> {/* Textarea */}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: CV/Resume */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-6 w-24" /> {/* Header: CV/Resume */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" /> {/* Label */}
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-full" /> {/* File Input/Button */}
                </div>
                <Skeleton className="h-3 w-64" /> {/* Helper text */}
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Social Links */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-6 w-24" /> {/* Header: Social Links */}
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" /> {/* Label: LinkedIn */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" /> {/* Label: GitHub */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
            </CardContent>
          </Card>

          {/* Button Group */}
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" /> {/* Save Button */}
            <Skeleton className="h-10 w-24" /> {/* Cancel Button */}
          </div>
        </div>
      </div>
    </div>
  )
}

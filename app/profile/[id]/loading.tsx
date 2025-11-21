import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header Skeleton */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0">
                  <Skeleton className="w-32 h-32 rounded-full" />
                </div>

                <div className="grow space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2 flex-col md:flex-row md:items-center md:gap-3">
                      <Skeleton className="h-9 w-48" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full max-w-2xl mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <Skeleton className="h-8 w-12 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div>
                      <Skeleton className="h-8 w-12 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>

                  {/* Social Links Skeleton */}
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[200px]">
                  <div className="space-y-2">
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Section Skeleton */}
          <div>
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex flex-col overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent className="grow space-y-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <Skeleton className="h-9 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

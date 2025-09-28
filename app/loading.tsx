import { FeaturedCardSkeleton, EventCardSkeleton } from '@/components/ui/LoadingSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-20">
        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <div className="w-full rounded-xl bg-gray-200 py-4 animate-pulse h-12" />
        </div>

        {/* Featured Events Skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {Array.from({ length: 3 }).map((_, i) => (
            <FeaturedCardSkeleton key={i} />
          ))}
        </div>

        {/* Category Tabs Skeleton */}
        <div className="flex gap-8 border-b border-gray-200 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="pb-3">
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Events Skeleton */}
        <div className="mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {Array.from({ length: 5 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
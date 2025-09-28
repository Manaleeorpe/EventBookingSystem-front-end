export function FeaturedCardSkeleton() {
  return (
    <div className="min-w-[280px] overflow-hidden rounded-2xl animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="bg-white p-4 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="min-w-[160px] overflow-hidden rounded-2xl animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
    </div>
  )
}

export function SearchBarSkeleton() {
  return (
    <div className="w-full rounded-xl bg-gray-200 py-4 animate-pulse h-12 mb-6" />
  )
}
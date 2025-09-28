'use client'
import { 
  HomeIcon,
  TrophyIcon,
  PaintBrushIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'
import { CategoryType } from '@/lib/types'

const categories = [
  { 
    id: 'music' as CategoryType, 
    name: 'Music', 
    icon: HomeIcon 
  },
  { 
    id: 'sports' as CategoryType, 
    name: 'Sports', 
    icon: TrophyIcon 
  },
  { 
    id: 'culture' as CategoryType, 
    name: 'Arts & Culture', 
    icon: PaintBrushIcon 
  },
  { 
    id: 'food' as CategoryType, 
    name: 'Food & Drink', 
    icon: UserGroupIcon 
  },
  { 
    id: 'workshop' as CategoryType, 
    name: 'Workshops', 
    icon: WrenchScrewdriverIcon 
  },
]

interface CategoryTabsProps {
  activeCategory?: CategoryType
  onCategoryChange: (category: CategoryType) => void
}

export default function CategoryTabs({ activeCategory = 'music', onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide px-1">
      {categories.map((category) => {
        const IconComponent = category.icon
        const isActive = activeCategory === category.id
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <IconComponent className="h-5 w-5" />
            {category.name}
          </button>
        )
      })}
    </div>
  )
}
import { 
  HomeIcon,
  Trophy,
  Paintbrush2,
  UtensilsCrossed,
  Wrench
} from 'lucide-react'
import { CategoryType } from '@/lib/types'

export const categories = [
  { id: 'music' as CategoryType, name: 'Music', icon: HomeIcon },
  { id: 'sports' as CategoryType, name: 'Sports', icon: Trophy },
  { id: 'culture' as CategoryType, name: 'Arts & Culture', icon: Paintbrush2 },
  { id: 'food' as CategoryType, name: 'Food & Drink', icon: UtensilsCrossed },
  { id: 'workshop' as CategoryType, name: 'Workshops', icon: Wrench },
]
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  CalendarIcon,
  TicketIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid } from '@heroicons/react/24/solid';

import { useUser } from '@/app/UserContext';

type NavItem = {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  badge?: string;
  isModal?: boolean;
};

const baseNav: NavItem[] = [
  { name: 'Home', icon: HomeIcon, activeIcon: HomeIconSolid, href: '/' },
  { name: 'Calendar', icon: CalendarIcon, href: '/calendar', badge: '3' },
  { name: 'Tickets', icon: TicketIcon, href: '/api/tickets', badge: '1' },
  { name: 'Profile', icon: UserIcon, href: '/profile', isModal: true },
];

interface BottomNavigationProps {
  onProfileClick?: () => void;
}

export default function BottomNavigation({
  onProfileClick,
}: BottomNavigationProps) {
  const pathname = usePathname();
  const { user, loading } = useUser();

  // Build label for the fourth item based on user
  const profileLabel =
    user && !loading
      ? `${user.name ?? 'User'} — ${user.email ?? ''}`.trim()
      : 'Profile';

  const navItems: NavItem[] = baseNav.map((item) =>
    item.name === 'Profile' ? { ...item, name: profileLabel } : item
  );

  const handleItemClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.isModal && onProfileClick) {
      e.preventDefault();
      onProfileClick();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const IconComponent = isActive ? item.activeIcon || item.icon : item.icon;

          const content = (
            <>
              <IconComponent
                className={`h-6 w-6 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-xs mt-1 text-center max-w-[120px] truncate ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
                title={item.name}
              >
                {item.name}
              </span>
              {item.badge && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </div>
              )}
            </>
          );

          return item.isModal ? (
            <button
              key={index}
              onClick={(e) => handleItemClick(item, e)}
              className="flex flex-col items-center py-2 px-4 relative"
            >
              {content}
            </button>
          ) : (
            <Link
              key={index}
              href={item.href}
              onClick={(e) => handleItemClick(item, e)}
              className="flex flex-col items-center py-2 px-4 relative"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
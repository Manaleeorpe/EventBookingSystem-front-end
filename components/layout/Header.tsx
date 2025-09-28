import { CalendarIcon, UserIcon, PlusIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onAddEvent?: () => void;
}

export default function Header({ onAddEvent }: HeaderProps) {
  return (
    <div className="flex justify-between items-center pl-4 pr-6 py-2 mb-4">
      {/* 👉 Left side title */}
      <h1 className="text-lg font-bold text-gray-800">
        Event Booking System
      </h1>

      {/* 👉 Right side icons */}
      <div className="flex gap-3">
        <button 
          onClick={onAddEvent}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          title="Add Event"
        >
          <PlusIcon className="h-5 w-5 text-gray-700" />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
          <CalendarIcon className="h-5 w-5 text-gray-700" />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
          <UserIcon className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
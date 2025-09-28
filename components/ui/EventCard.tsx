import { useMemo } from 'react';
import Image from 'next/image';

interface EventCardProps {
  title: string;
  location: string;
  imageUrl?: string | null;
  onClick?: () => void;
}
export default function EventCard({ title, location, imageUrl, onClick }: EventCardProps) {
  const fallbackByTitle = useMemo(() => {
    const seed = Math.abs(
      title.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    );
    const eventImages = [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68e1f?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0801ba2fe65?w=400&h=500&fit=crop',
    ];
    return eventImages[seed % eventImages.length];
  }, [title]);

  const src = imageUrl || fallbackByTitle; // prefer API image

  return (
    <div
      className="relative min-w-[160px] overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[4/5] relative">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 160px, 180px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-3 text-white">
          <h3 className="text-base font-bold leading-tight mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-200 opacity-90">{location}</p>
        </div>
      </div>
    </div>
  );
}
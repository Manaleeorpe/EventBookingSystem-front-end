import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Event } from '@/lib/types';

interface FeaturedCardProps {
  title: string;
  subtitle: string;
  location: string;
  imageUrl?: string | null;
  id?: number;
  category?: string;
  onClick: () => void;
}

export default function FeaturedCard({
  title,
  subtitle,
  location,
  imageUrl,
  category,
  onClick,
}: FeaturedCardProps) {
  const fallback =
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop';

  const computedUrl = useMemo(() => {
    if (imageUrl) return imageUrl;
    const categoryImages: Record<string, string> = {
      tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      music:
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
      sports:
        'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
      culture:
        'https://images.unsplash.com/photo-1445091063398-7233d5d84b91?w=800&h=600&fit=crop',
      food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      workshop:
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
    };
    return category && categoryImages[category]
      ? categoryImages[category]
      : fallback;
  }, [imageUrl, category]);

  const [src, setSrc] = useState<string>(computedUrl);
  useMemo(() => setSrc(computedUrl), [computedUrl]);

  return (
    <div
      className="relative flex-none w-[300px] sm:w-[360px] overflow-hidden rounded-2xl bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 300px, 360px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/2wCEAAIBAQEBAQIBAQICAgICAgQDAgICAQMDBAQEBAQEBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/2wCEAAICAwMDBAQEBAQFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUH/wAARCAAFAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAcEAABAwUAAAAAAAAAAAAAAAABAAIDBBIhQnH/xAAUAQEAAAAAAAAAAAAAAAAAAAAE/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQARIf/aAAwDAQACEQMRAD8AqgGzGm9vFJkqz7mU8wC6g9P2m3vS9k3zVqg5b2nZ0J4t2cVv6K6vEwQkQ6qK7i3r8RkH//Z"
          onError={() => setSrc(fallback)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl sm:text-2xl font-bold leading-tight line-clamp-2">
            {title}
          </h3>
        </div>
      </div>

      <div className="bg-white p-4">
        <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2">
          {subtitle}
        </h4>
        <p className="text-xs sm:text-sm text-gray-500">{location}</p>
      </div>
    </div>
  );
}
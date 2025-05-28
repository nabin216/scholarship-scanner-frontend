'use client';

import React from 'react';
import Image from 'next/image';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Profile', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  if (!src) {
    return (
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100`}>
        <UserCircleIcon className="w-full h-full text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default Avatar;

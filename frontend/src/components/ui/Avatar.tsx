import React, { useMemo } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name?: string;
  size?: AvatarSize;
  isAdmin?: boolean;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-20 w-20 text-xl',
};

const gradients = {
  admin: 'bg-gradient-to-br from-primary-500 to-primary-700',
  user: 'bg-gradient-to-br from-success-500 to-success-700',
};

export const Avatar: React.FC<AvatarProps> = ({
  name = 'U',
  size = 'md',
  isAdmin = false,
  className = '',
}) => {
  const initial = useMemo(() => {
    return name.charAt(0).toUpperCase();
  }, [name]);

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${isAdmin ? gradients.admin : gradients.user}
        rounded-xl flex items-center justify-center text-white font-bold
        shadow-sm select-none
        ${className}
      `}
      aria-label={`Avatar for ${name}`}
    >
      {initial}
    </div>
  );
};

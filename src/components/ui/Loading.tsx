import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading = ({ className, size = 'md', text }: LoadingProps) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div className={cn('animate-spin rounded-full border-4 border-primary-200 border-t-primary-500', sizes[size])}></div>
      {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
    </div>
  );
};
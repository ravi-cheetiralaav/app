interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div 
      className={`
        bg-white rounded-3xl p-6 shadow-soft 
        ${hover ? 'hover:shadow-kid-friendly hover:-translate-y-2 transition-all duration-300' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface AnimatedIconProps {
  emoji: string;
  animation?: 'bounce' | 'wiggle' | 'float' | 'pulse';
  className?: string;
}

export function AnimatedIcon({ 
  emoji, 
  animation = 'bounce', 
  className = '' 
}: AnimatedIconProps) {
  const animationClasses = {
    bounce: 'animate-gentle-bounce',
    wiggle: 'animate-wiggle',
    float: 'animate-float',
    pulse: 'animate-pulse-slow'
  };
  
  return (
    <span className={`text-4xl ${animationClasses[animation]} ${className}`}>
      {emoji}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'success', 
  className = '' 
}: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };
  
  return (
    <span 
      className={`
        inline-block px-3 py-1 rounded-full text-sm font-semibold
        ${variantClasses[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
}
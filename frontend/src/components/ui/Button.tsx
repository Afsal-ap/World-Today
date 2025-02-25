interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'outline';
}

export const Button = ({ children, className, onClick, variant }: ButtonProps) => (
  <button 
    className={`${variant === 'outline' ? 'border bg-transparent' : 'bg-blue-500 text-white'} p-2 rounded-md ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

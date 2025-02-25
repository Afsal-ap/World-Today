interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={`border rounded-lg p-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className }: CardContentProps) => (
  <div className={`p-4 ${className}`}>{children}</div>
);


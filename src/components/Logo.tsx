
import { useState } from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/lovable-uploads/0c4d24de-a551-4d26-ae8a-3e70ef439b44.png"
        alt="Regency BarWise Logo" 
        className="h-8 w-auto"
        onError={() => setImageError(true)}
        style={{ display: imageError ? 'none' : 'block' }}
      />
      {showText && (
        <span className="font-semibold text-lg">Regency BarWise</span>
      )}
    </div>
  );
}

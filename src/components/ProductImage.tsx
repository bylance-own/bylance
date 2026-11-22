import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ProductImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  size?: 'normal' | 'thumb';
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  containerClassName = '',
  size = 'normal',
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(!src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(!src);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [currentSrc]);

  const roundedCls = size === 'thumb' ? 'rounded-lg' : 'rounded-2xl';

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setLoaded(false);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-white ${roundedCls} ${containerClassName}`}>
      {/* Subtle Loading Indicator Underneath (never blocks the image itself) */}
      {!loaded && !hasError && currentSrc && (
        <div className={`absolute inset-0 flex items-center justify-center bg-white z-0 pointer-events-none ${roundedCls}`}>
          <Loader2 className={`${size === 'thumb' ? 'w-4 h-4 text-[#7a0f2d]/50' : 'w-6 h-6 text-[#7a0f2d]/50'} animate-spin`} />
        </div>
      )}

      {/* Fallback in case of missing or broken photo */}
      {hasError || !currentSrc ? (
        <div className="flex flex-col items-center justify-center text-[#7a0f2d]/70 p-3 text-center relative z-10">
          <div className="w-10 h-10 rounded-full bg-[#ffead1]/70 border border-[#7a0f2d]/15 flex items-center justify-center font-black text-sm text-[#7a0f2d]">
            B
          </div>
          <span className="text-[11px] font-semibold text-slate-500 mt-1.5 line-clamp-2 max-w-[160px]">{alt}</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          loading="eager"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`relative z-10 ${className} ${roundedCls} transition-transform duration-300`}
        />
      )}
    </div>
  );
};

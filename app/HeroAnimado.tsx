"use client";

import { useEffect, useState, useRef } from "react";

export default function HeroAnimado() {
  const [frameIndex, setFrameIndex] = useState(1);
  const totalFrames = 7; 
  const scrollTarget = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollTarget.current = window.scrollY;
      
      const isMobile = window.innerWidth < 768;
      const scrollRange = isMobile ? 250 : 1200; 
      const progress = scrollTarget.current / scrollRange;
      
      let index;
      if (progress <= 1) {
        index = isMobile ? 1 : Math.min(Math.floor(progress * totalFrames) + 1, totalFrames);
      } else {
        index = 8;
      }
      setFrameIndex(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isFinalFrame = frameIndex === 8;

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-[100vh] md:h-[350vh] pointer-events-none" />

      <div className="sticky top-0 h-screen w-full flex flex-col items-center bg-white overflow-hidden">
        
     

        <div className="relative w-full h-full flex flex-col items-center">
          
          {/* IDENTIDAD: Logo y Título */}
          <div 
            className={`z-20 flex flex-col items-center transition-all duration-700 pt-2 ${
              isFinalFrame ? 'opacity-0 -translate-y-10 pointer-events-none' : 'opacity-100'
            }`}
          >
            <img 
              src="/logo_ks.png" 
              alt="Logo KS" 
              className="w-48 h-48 md:w-80 md:h-80 object-contain" 
            />
            <h1 className="text-zinc-900 font-black text-5xl md:text-8xl tracking-[0.2em] uppercase italic leading-none -mt-4">
              KS STUDIO
            </h1>
          </div>

          {/* FOTO INICIAL */}
          {!isFinalFrame && (
            <div className="w-full max-w-md md:max-w-xl h-[30vh] md:h-[40vh] -mt-2 flex justify-center items-start">
              <img
                src={`/${frameIndex}.png`} 
                alt={`Frame ${frameIndex}`}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* 
            FOTO 8: CORRECCIÓN MÓVIL APLICADA
            - items-start pt-[10vh]: Lo empujamos hacia arriba en móvil.
            - h-[40vh]: Le limitamos la altura para que no baje hasta donde empieza el panel.
            - En md: recupera el centrado y el h-full.
          */}
          <div className={`absolute inset-0 z-50 flex items-start md:items-center justify-center p-4 pt-[10vh] md:pt-4 bg-white/80 backdrop-blur-md transition-all duration-1000 ease-in-out ${
            isFinalFrame ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}>
            <img
              src="/8.png" 
              alt="Imagen Final"
              className={`w-full max-w-7xl object-contain transition-transform duration-1000 
                h-[40vh] md:h-full 
                ${isFinalFrame ? 'scale-100 md:scale-110' : 'scale-90'}
              `}
            />
          </div>
        </div>
      </div>
    </>
  );
}
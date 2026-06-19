import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import ResponsiveImage from './ResponsiveImage.jsx';

export default function HeroCarousel({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [bgColor, setBgColor] = useState('#f0fdf4'); // verde muy clarito por defecto
  const imageRefs = useRef({});

  const goTo = useCallback((index) => setActiveIndex(index), []);
  const goPrev = useCallback(
    () => setActiveIndex((p) => (p === 0 ? slides.length - 1 : p - 1)),
    [slides.length]
  );
  const goNext = useCallback(
    () => setActiveIndex((p) => (p === slides.length - 1 ? 0 : p + 1)),
    [slides.length]
  );

  // Extraer color dominante enfocándose en los bordes (más representativo para el fondo)
  const getBorderColor = (imgElement) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

      // Tomamos muestras de las cuatro esquinas y centro de los bordes
      const samplePoints = [
        { x: 0, y: 0 }, // esquina superior izquierda
        { x: canvas.width - 1, y: 0 }, // superior derecha
        { x: 0, y: canvas.height - 1 }, // inferior izquierda
        { x: canvas.width - 1, y: canvas.height - 1 }, // inferior derecha
        { x: Math.floor(canvas.width / 2), y: 0 }, // borde superior centro
        { x: Math.floor(canvas.width / 2), y: canvas.height - 1 }, // borde inferior centro
      ];

      let r = 0, g = 0, b = 0;
      let count = 0;

      samplePoints.forEach(point => {
        const pixel = ctx.getImageData(point.x, point.y, 1, 1).data;
        r += pixel[0];
        g += pixel[1];
        b += pixel[2];
        count++;
      });

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      resolve(`rgb(${r}, ${g}, ${b})`);
    });
  };

  useEffect(() => {
    const currentImg = imageRefs.current[activeIndex];
    if (!currentImg) return;

    const handleLoad = () => {
      getBorderColor(currentImg).then(color => setBgColor(color));
    };

    if (currentImg.complete && currentImg.naturalWidth !== 0) {
      handleLoad();
    } else {
      currentImg.addEventListener('load', handleLoad);
      return () => currentImg.removeEventListener('load', handleLoad);
    }
  }, [activeIndex]);

  // Resetea al color por defecto al cambiar de slide (para que haya transición)
  useEffect(() => {
    setBgColor('#f0fdf4');
  }, [activeIndex]);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    // Contenedor externo más ancho (antes max-w-7xl, ahora max-w-[90rem])
    <div className="w-full max-w-[90rem] mx-auto px-4 lg:px-8">
      <div className="bg-surface border-b-[1.5px] border-border pt-6 pb-0">
        <div className="rounded-2xl overflow-hidden border-[1.5px] border-border shadow-[0_4px_20px_rgba(13,27,9,0.10)]">
          <div id="heroCarousel" className="relative w-full">
            {/* Indicadores */}
            <div className="flex absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 z-30">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-[3px] rounded-sm border-none transition-all duration-[0.22s] cursor-pointer ${
                    i === activeIndex
                      ? 'w-8 bg-green'
                      : 'w-5 bg-[rgba(255,255,255,0.4)]'
                  }`}
                  aria-label={`Ir a slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Fondo con transición suave y altura ligeramente mayor */}
            <div
              className="relative w-full overflow-hidden max-h-[70vh] min-h-[220px] transition-colors duration-700 ease-in-out"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="
                  w-full
                  aspect-[21/10]      // móvil
                  sm:aspect-[21/9]    
                  md:aspect-[16/9]    
                  lg:aspect-[21/9]    
                  xl:aspect-[3/1]     
                  2xl:aspect-[3.5/1]  // un poco más alto en ultra anchas
                "
              >
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`w-full h-full transition-opacity duration-500 ease-in-out ${
                      index === activeIndex
                        ? 'opacity-100 relative'
                        : 'opacity-0 absolute inset-0'
                    }`}
                  >
                    {index === activeIndex && (
                      <ResponsiveImage
                        srcSmall={slide.image_small || slide.image}
                        srcLarge={slide.image_large || slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        style={{ filter: 'saturate(1.02)' }}
                        imgRef={(el) => (imageRefs.current[index] = el)}
                        crossOrigin="Anonymous"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Capa de texto inferior (sin cambios relevantes) */}
            <div className="absolute left-0 right-0 bottom-0 z-20 p-6 lg:p-8 pointer-events-none">
              <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 bg-green text-white text-[0.7rem] font-bold px-2.5 py-1 rounded-full mb-2.5 tracking-wider uppercase pointer-events-auto">
                  ☀ Cotizador Inteligente
                </div>
                <h2
                  className="font-num text-white text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight pointer-events-auto [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]"
                  dangerouslySetInnerHTML={{ __html: slides[activeIndex]?.title || '' }}
                />
                <p className="text-[rgba(255,255,255,0.9)] text-sm mt-1 pointer-events-auto [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
                  {slides[activeIndex]?.description}
                </p>
              </div>
            </div>

            {/* Flechas - sin cambios pero ya están bien */}
            <button
              onClick={goPrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-[0.22s] hover:bg-green hover:border-green text-white"
              aria-label="Anterior"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-[0.22s] hover:bg-green hover:border-green text-white"
              aria-label="Siguiente"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

HeroCarousel.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      image_small: PropTypes.string,
      image_large: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};
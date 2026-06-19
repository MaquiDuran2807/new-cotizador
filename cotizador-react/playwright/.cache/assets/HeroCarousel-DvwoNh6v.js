import { j as jsxRuntimeExports } from './jsx-runtime-AgFCCyoZ.js';
import { r as reactExports } from './index-CHSTDiNz.js';
import { P as PropTypes } from './index-Bj4csNK1.js';

function ResponsiveImage({ srcSmall, srcLarge, alt, className, style, loading = "lazy", decoding = "async", imgRef, ...rest }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("picture", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("source", { media: "(max-width: 767px)", srcSet: srcSmall }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("source", { media: "(min-width: 768px)", srcSet: srcLarge || srcSmall }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        ref: imgRef,
        src: srcLarge || srcSmall,
        alt,
        className,
        style,
        loading,
        decoding,
        ...rest
      }
    )
  ] });
}
ResponsiveImage.propTypes = {
  srcSmall: PropTypes.string,
  srcLarge: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  loading: PropTypes.string,
  decoding: PropTypes.string,
  imgRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ])
};

function HeroCarousel({ slides }) {
  const [activeIndex, setActiveIndex] = reactExports.useState(0);
  const [bgColor, setBgColor] = reactExports.useState("#f0fdf4");
  const imageRefs = reactExports.useRef({});
  const goTo = reactExports.useCallback((index) => setActiveIndex(index), []);
  const goPrev = reactExports.useCallback(
    () => setActiveIndex((p) => p === 0 ? slides.length - 1 : p - 1),
    [slides.length]
  );
  const goNext = reactExports.useCallback(
    () => setActiveIndex((p) => p === slides.length - 1 ? 0 : p + 1),
    [slides.length]
  );
  const getBorderColor = (imgElement) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
      const samplePoints = [
        { x: 0, y: 0 },
        // esquina superior izquierda
        { x: canvas.width - 1, y: 0 },
        // superior derecha
        { x: 0, y: canvas.height - 1 },
        // inferior izquierda
        { x: canvas.width - 1, y: canvas.height - 1 },
        // inferior derecha
        { x: Math.floor(canvas.width / 2), y: 0 },
        // borde superior centro
        { x: Math.floor(canvas.width / 2), y: canvas.height - 1 }
        // borde inferior centro
      ];
      let r = 0, g = 0, b = 0;
      let count = 0;
      samplePoints.forEach((point) => {
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
  reactExports.useEffect(() => {
    const currentImg = imageRefs.current[activeIndex];
    if (!currentImg) return;
    const handleLoad = () => {
      getBorderColor(currentImg).then((color) => setBgColor(color));
    };
    if (currentImg.complete && currentImg.naturalWidth !== 0) {
      handleLoad();
    } else {
      currentImg.addEventListener("load", handleLoad);
      return () => currentImg.removeEventListener("load", handleLoad);
    }
  }, [activeIndex]);
  reactExports.useEffect(() => {
    setBgColor("#f0fdf4");
  }, [activeIndex]);
  reactExports.useEffect(() => {
    const timer = setInterval(goNext, 5e3);
    return () => clearInterval(timer);
  }, [goNext]);
  return (
    // Contenedor externo más ancho (antes max-w-7xl, ahora max-w-[90rem])
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-[90rem] mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-surface border-b-[1.5px] border-border pt-6 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl overflow-hidden border-[1.5px] border-border shadow-[0_4px_20px_rgba(13,27,9,0.10)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "heroCarousel", className: "relative w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 z-30", children: slides.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => goTo(i),
          className: `h-[3px] rounded-sm border-none transition-all duration-[0.22s] cursor-pointer ${i === activeIndex ? "w-8 bg-green" : "w-5 bg-[rgba(255,255,255,0.4)]"}`,
          "aria-label": `Ir a slide ${i + 1}`
        },
        i
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "relative w-full overflow-hidden max-h-[70vh] min-h-[220px] transition-colors duration-700 ease-in-out",
          style: { backgroundColor: bgColor },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "\n                  w-full\n                  aspect-[21/10]      // móvil\n                  sm:aspect-[21/9]    \n                  md:aspect-[16/9]    \n                  lg:aspect-[21/9]    \n                  xl:aspect-[3/1]     \n                  2xl:aspect-[3.5/1]  // un poco más alto en ultra anchas\n                ",
              children: slides.map((slide, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `w-full h-full transition-opacity duration-500 ease-in-out ${index === activeIndex ? "opacity-100 relative" : "opacity-0 absolute inset-0"}`,
                  children: index === activeIndex && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ResponsiveImage,
                    {
                      srcSmall: slide.image_small || slide.image,
                      srcLarge: slide.image_large || slide.image,
                      alt: slide.title,
                      className: "w-full h-full object-contain",
                      style: { filter: "brightness(0.92) saturate(0.98)" },
                      imgRef: (el) => imageRefs.current[index] = el,
                      crossOrigin: "Anonymous"
                    }
                  )
                },
                index
              ))
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 right-0 bottom-0 z-20 p-6 lg:p-8 bg-gradient-to-t from-[rgba(13,27,9,0.9)] to-transparent pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto lg:mx-0 text-center lg:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-1.5 bg-green text-white text-[0.7rem] font-bold px-2.5 py-1 rounded-full mb-2.5 tracking-wider uppercase pointer-events-auto", children: "☀ Cotizador Inteligente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "font-num text-white text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight pointer-events-auto",
            dangerouslySetInnerHTML: { __html: slides[activeIndex]?.title || "" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[rgba(255,255,255,0.8)] text-sm mt-1 pointer-events-auto", children: slides[activeIndex]?.description })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: goPrev,
          className: "absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-[0.22s] hover:bg-green hover:border-green text-white",
          "aria-label": "Anterior",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: goNext,
          className: "absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-[0.22s] hover:bg-green hover:border-green text-white",
          "aria-label": "Siguiente",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" }) })
        }
      )
    ] }) }) }) })
  );
}
HeroCarousel.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      image_small: PropTypes.string,
      image_large: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

export { HeroCarousel as default };
//# sourceMappingURL=HeroCarousel-DvwoNh6v.js.map

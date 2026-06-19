import { test, expect } from '@playwright/experimental-ct-react'
import HeroCarousel from '../../src/components/HeroCarousel.jsx'
import { RESOLUTIONS, expectNoHorizontalOverflow } from './helpers.js'

function greenSvg(w, h, label) {
  const text = label ? `<text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="28" fill="white" font-family="sans-serif">${label}</text>` : ''
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E%3Crect fill='%2340C92A' width='100%25' height='100%25'/%3E${encodeURIComponent(text)}%3C/svg%3E`
}

function blueSvg(w, h, label) {
  const text = label ? `<text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="28" fill="white" font-family="sans-serif">${label}</text>` : ''
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E%3Crect fill='%237C3AED' width='100%25' height='100%25'/%3E${encodeURIComponent(text)}%3C/svg%3E`
}

const mockSlides = [
  {
    id: 1,
    image: greenSvg(1600, 533, 'Energía Solar'),
    image_small: greenSvg(800, 267, 'Energía Solar'),
    image_large: greenSvg(1920, 540, 'Energía Solar'),
    title: 'Energía Solar para tu <strong>Hogar</strong>',
    description: 'Descubre cómo reducir tu factura de luz hasta un 90% con nuestros sistemas solares personalizados para viviendas unifamiliares.',
    order: 1,
    is_active: true,
  },
  {
    id: 2,
    image: blueSvg(1600, 533, 'Respaldos'),
    image_small: blueSvg(800, 267, 'Respaldos'),
    image_large: blueSvg(1920, 540, 'Respaldos'),
    title: 'Respaldos de Energía <strong>Garantizados</strong>',
    description: 'Sistemas de backup con baterías de litio LFP que mantienen tus equipos críticos funcionando incluso durante cortes eléctricos prolongados.',
    order: 2,
    is_active: true,
  },
  {
    id: 3,
    title: 'Instalación <strong>Profesional</strong>',
    description: 'Más de 500 instalaciones exitosas en toda Colombia. Ingenieros certificados y garantía de 5 años en todos nuestros sistemas.',
    image: greenSvg(1600, 533, 'Instalación'),
    image_large: greenSvg(1920, 540, 'Instalación'),
    order: 3,
    is_active: true,
  },
  {
    id: 4,
    image: blueSvg(1600, 533, 'Comercial'),
    image_small: blueSvg(800, 267, 'Comercial'),
    image_large: blueSvg(1920, 540, 'Comercial'),
    title: 'Soluciones <strong>Comerciales</strong> e <strong>Industriales</strong>',
    description: 'Proyectos llave en mano para empresas: análisis de viabilidad, diseño, instalación y monitoreo en tiempo real de tu generación solar.',
    order: 4,
    is_active: true,
  },
]

for (const { name: resName, width, height } of RESOLUTIONS) {
  test(`${resName} — sin overflow horizontal`, async ({ mount, page }) => {
    await page.setViewportSize({ width, height })
    const component = await mount(
      <div style={{ width: '100%', background: '#F4F9F2' }}>
        <HeroCarousel slides={mockSlides} />
      </div>,
    )

    await page.waitForTimeout(800)

    await expectNoHorizontalOverflow(component)

    await expect(component).toHaveScreenshot(`hero-carousel-${resName}.png`)
  })
}

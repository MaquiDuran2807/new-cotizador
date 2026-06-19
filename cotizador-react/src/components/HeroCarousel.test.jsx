import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroCarousel from './HeroCarousel.jsx'

describe('HeroCarousel', () => {
  const slides = [
    {
      id: 1,
      image: '/media/carousel/img1.jpg',
      image_small: null,
      image_large: null,
      title: 'Slide 1',
      description: 'Desc 1',
    },
    {
      id: 2,
      image: '/media/carousel/img2.jpg',
      image_small: '/media/carousel/thumbs/img2_small.jpg',
      image_large: '/media/carousel/large/img2_large.jpg',
      title: 'Slide 2',
      description: 'Desc 2',
    },
  ]

  it('renders first slide image with fallback when variants are null', () => {
    render(<HeroCarousel slides={slides} />)
    const img = screen.getByAltText('Slide 1')
    expect(img).toHaveAttribute('src', '/media/carousel/img1.jpg')
  })

  it('renders picture sources for first slide with fallback', () => {
    render(<HeroCarousel slides={slides} />)
    const sources = document.querySelectorAll('picture source')
    expect(sources[0]).toHaveAttribute('srcset', '/media/carousel/img1.jpg')
  })

  it('uses image_small/image_large when available', () => {
    // Force second slide as active
    const { rerender } = render(<HeroCarousel slides={slides} />)
    rerender(<HeroCarousel slides={[slides[1]]} />)
    const img = screen.getByAltText('Slide 2')
    expect(img).toHaveAttribute('src', '/media/carousel/large/img2_large.jpg')
  })
})

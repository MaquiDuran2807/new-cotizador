import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResponsiveImage from './ResponsiveImage.jsx'

describe('ResponsiveImage', () => {
  const defaultAlt = 'test alt'

  it('renders img with srcLarge when both variants provided', () => {
    render(<ResponsiveImage srcSmall="/small.jpg" srcLarge="/large.jpg" alt={defaultAlt} />)
    const img = screen.getByAltText(defaultAlt)
    expect(img).toHaveAttribute('src', '/large.jpg')
  })

  it('renders img with srcSmall when srcLarge is null', () => {
    render(<ResponsiveImage srcSmall="/small.jpg" srcLarge={null} alt={defaultAlt} />)
    const img = screen.getByAltText(defaultAlt)
    expect(img).toHaveAttribute('src', '/small.jpg')
  })

  it('renders img without src when both are null', () => {
    render(<ResponsiveImage srcSmall={null} srcLarge={null} alt={defaultAlt} />)
    const img = screen.getByAltText(defaultAlt)
    expect(img).not.toHaveAttribute('src')
  })

  it('renders picture with correct source media queries', () => {
    render(<ResponsiveImage srcSmall="/small.jpg" srcLarge="/large.jpg" alt={defaultAlt} />)
    const sources = document.querySelectorAll('picture source')
    expect(sources).toHaveLength(2)
    expect(sources[0]).toHaveAttribute('media', '(max-width: 767px)')
    expect(sources[0]).toHaveAttribute('srcset', '/small.jpg')
    expect(sources[1]).toHaveAttribute('media', '(min-width: 768px)')
    expect(sources[1]).toHaveAttribute('srcset', '/large.jpg')
  })

  it('renders img with lazy loading by default', () => {
    render(<ResponsiveImage srcSmall="/s.jpg" srcLarge="/l.jpg" alt={defaultAlt} />)
    const img = screen.getByAltText(defaultAlt)
    expect(img).toHaveAttribute('loading', 'lazy')
  })
})

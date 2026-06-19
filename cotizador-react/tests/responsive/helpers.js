import { expect } from '@playwright/experimental-ct-react'

export const RESOLUTIONS = [
  { name: '320px',  width: 320,  height: 568  },
  { name: '375px',  width: 375,  height: 812  },
  { name: '768px',  width: 768,  height: 1024 },
  { name: '1024px', width: 1024, height: 768  },
  { name: '1280px', width: 1280, height: 800  },
  { name: '1920px', width: 1920, height: 1080 },
]

export async function expectNoHorizontalOverflow(locator) {
  const overflows = await locator.evaluate(el => {
    const results = []
    const walk = node => {
      if (node.nodeType !== 1) return
      const style = window.getComputedStyle(node)
      if (style.display === 'none' || style.visibility === 'hidden') return
      if (node.scrollWidth > node.clientWidth + 0.5) {
        results.push({
          tag: node.tagName,
          id: node.id || '(none)',
          cls: (node.className || '').substring(0, 100),
          overflowX: style.overflowX,
          scrollW: node.scrollWidth,
          clientW: node.clientWidth,
        })
      }
      for (let i = 0; i < node.children.length; i++) walk(node.children[i])
    }
    walk(el)
    return results
  })

  if (overflows.length > 0) {
    // eslint-disable-next-line no-console
    console.log('[OVERFLOW]', JSON.stringify(overflows, null, 2))
  }
  expect(overflows).toHaveLength(0)
}

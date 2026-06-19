import { test, expect } from '@playwright/experimental-ct-react'
import Footer from '../../src/components/Footer.jsx'
import { RESOLUTIONS, expectNoHorizontalOverflow } from './helpers.js'

for (const { name: resName, width, height } of RESOLUTIONS) {
  test(`${resName} — sin overflow horizontal`, async ({ mount, page }) => {
    await page.setViewportSize({ width, height })
    const component = await mount(
      <div style={{ width: '100%' }}>
        <Footer />
      </div>,
    )

    await page.waitForTimeout(300)

    await expectNoHorizontalOverflow(component)

    await expect(component).toHaveScreenshot(`footer-${resName}.png`)
  })
}

import { test, expect } from '@playwright/experimental-ct-react'
import PdfDownloadButton from '../../src/components/PdfDownloadButton.jsx'
import { RESOLUTIONS, expectNoHorizontalOverflow } from './helpers.js'

for (const { name: resName, width, height } of RESOLUTIONS) {
  test(`${resName} — botón normal sin overflow`, async ({ mount, page }) => {
    await page.setViewportSize({ width, height })
    const component = await mount(
      <div style={{ width: '100%', padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F4F9F2' }}>
        <PdfDownloadButton onClick={() => {}} />
      </div>,
    )

    await expectNoHorizontalOverflow(component)
    await expect(component).toHaveScreenshot(`pdf-btn-normal-${resName}.png`)
  })

  test(`${resName} — botón compact sin overflow`, async ({ mount, page }) => {
    await page.setViewportSize({ width, height })
    const component = await mount(
      <div style={{ width: '100%', padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#F4F9F2' }}>
        <PdfDownloadButton onClick={() => {}} compact />
      </div>,
    )

    await expectNoHorizontalOverflow(component)
    await expect(component).toHaveScreenshot(`pdf-btn-compact-${resName}.png`)
  })
}

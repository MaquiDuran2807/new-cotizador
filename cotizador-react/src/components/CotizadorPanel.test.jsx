import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CotizadorPanel from './CotizadorPanel.jsx'

const mockCalculation = {
  total_final_basic: 2500000,
  total_final_premiun: 3800000,
  panel_needed: { amount: 2, name: 'Panel 300W', price: 850000 },
  battery_needed: { amount: 1, name: 'Batería 100Ah', price: 1200000 },
}

describe('CotizadorPanel', () => {
  it('muestra los totales estándar y llave en mano correctamente', () => {
    render(
      <CotizadorPanel
        calculation={mockCalculation}
        quoteItems={[]}
        onRemoveRequirement={vi.fn()}
        onAddRequirement={vi.fn()}
        onRemoveItem={vi.fn()}
        onReset={vi.fn()}
      />,
    )
    expect(screen.getByText('$ 2.500.000')).toBeInTheDocument()
    expect(screen.getByText('$ 3.800.000')).toBeInTheDocument()
  })

  it('muestra mensaje vacío cuando no hay items', () => {
    render(
      <CotizadorPanel
        calculation={mockCalculation}
        quoteItems={[]}
        onRemoveRequirement={vi.fn()}
        onAddRequirement={vi.fn()}
        onRemoveItem={vi.fn()}
        onReset={vi.fn()}
      />,
    )
    expect(screen.getByText(/Aún no has agregado productos/)).toBeInTheDocument()
  })
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App.jsx'

vi.mock('./services/api.js', () => ({
  calculateQuote: vi.fn(),
  fetchCurrentUser: vi.fn(),
  fetchCarouselSlides: vi.fn(),
}))

import { calculateQuote, fetchCurrentUser, fetchCarouselSlides } from './services/api.js'

const mockProducts = [
  { id: 1, name: 'Panel Solar 300W', price: 850000, description: 'Panel de alta eficiencia', image: 'test.jpg' },
  { id: 2, name: 'Batería 100Ah', price: 1200000, description: 'Batería de ciclo profundo', image: 'test2.jpg' },
]

const mockCalculation = {
  consumptions: [],
  panel_needed: { amount: 1, name: 'Panel 300W', price: 850000 },
  battery_needed: { amount: 1, name: 'Batería 100Ah', price: 1200000 },
  regulator_needed: { amount: 1, name: 'Regulador 30A', price: 200000 },
  breaker_needed: { amount: 1, name: 'Breaker 20A', price: 50000 },
  rubberized_cable_needed: { amount: 10, name: 'Cable 10mm', price: 15000 },
  panel_support_needed: { amount: 1, name: 'Soporte', price: 80000 },
  centralized_modules_needed: { amount: 1, name: 'Módulo Central', price: 450000 },
  power_units_needed: { amount: 1, name: 'Unidad Potencia', price: 650000 },
  terminals_needed: { amount: 2, name: 'Terminal MC4', price: 5000 },
  connector_needed: { amount: 1, name: 'Conector Y', price: 15000 },
  vehicle_cable_needed: { amount: 5, name: 'Cable Vehicular', price: 12000 },
  electric_materials_needed: { amount: 1, name: 'Material Eléctrico', price: 35000 },
  ground_security_kit_needed: { amount: 1, name: 'Kit Tierra', price: 55000 },
  rack_bateria: { amount: 1, name: 'Rack Batería', price: 120000 },
  inversor: { amount: 1, name: 'Inversor 1000W', price: 800000 },
  productos: [],
  total_final_basic: 2500000,
  total_final_premiun: 3800000,
  totalPrecios: 2500000,
  totalConsumo: 1200,
}

describe('Integración: App con datos mock', () => {
  beforeEach(() => {
    const productsEl = document.createElement('script')
    productsEl.id = 'products-data'
    productsEl.type = 'application/json'
    productsEl.textContent = JSON.stringify(mockProducts)
    document.body.appendChild(productsEl)

    const userEl = document.createElement('script')
    userEl.id = 'user-data'
    userEl.type = 'application/json'
    userEl.textContent = JSON.stringify({ name: 'Test', email: 'test@test.com', lastname: 'User' })
    document.body.appendChild(userEl)
  })

  it('renderiza la app con productos y permite agregar al cotizador', async () => {
    fetchCurrentUser.mockResolvedValue({ name: 'Test', email: 'test@test.com', lastname: 'User' })
    calculateQuote.mockResolvedValue(mockCalculation)
    fetchCarouselSlides.mockResolvedValue([])

    render(<App />)

    expect(screen.getByText('Panel Solar 300W')).toBeInTheDocument()

    const addButtons = screen.getAllByText('Agregar')
    fireEvent.click(addButtons[0])

    await waitFor(() => {
      expect(calculateQuote).toHaveBeenCalled()
    }, { timeout: 3000 })
  })
})

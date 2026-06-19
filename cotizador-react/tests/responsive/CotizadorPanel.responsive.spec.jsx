import { test, expect } from '@playwright/experimental-ct-react'
import CotizadorPanel from '../../src/components/CotizadorPanel.jsx'
import { RESOLUTIONS, expectNoHorizontalOverflow } from './helpers.js'

const mockCalculation = {
  total_final_basic: 2500000,
  total_final_premiun: 3800000,
  total_precios: 850000,
  consumptions: [
    { consumption_hr: 120, consumption_day: 2400, loss_percentaje: 39, loss_consumption: 936, total_consumption_day: 3336 },
    { consumption_hr: 60, consumption_day: 1200, loss_percentaje: 39, loss_consumption: 468, total_consumption_day: 1668 },
  ],
  panel_needed: {
    name: 'Panel Solar Monocristalino 550W 144 Células PERC Alta Eficiencia',
    amount: 4,
    price: 850000,
    production: { total_production_day: 4800 },
  },
  battery_needed: { name: 'Batería Litio LFP 200Ah 51.2V con BMS Integrado', amount: 2, price: 3200000 },
  regulator_needed: { name: 'Regulador MPPT 100A 48V Tracker Dual', amount: 1, price: 580000 },
  breaker_needed: { name: 'Breaker Termomagnético 63A 2P AC/DC', amount: 3, price: 45000 },
  rubberized_cable_needed: { name: 'Cable Solar Rubson 10AWG (6mm²) 1000V', amount: 50, price: 3800 },
  panel_support_needed: { name: 'Estructura Soporte Techo Inclinado Ajustable', amount: 2, price: 165000 },
  centralized_modules_needed: { name: 'Módulo Centralizado Monitoreo WiFi 4G', amount: 1, price: 450000 },
  power_units_needed: { name: 'Unidad de Potencia 5000W 48V Onda Pura', amount: 1, price: 1200000 },
  terminals_needed: { name: 'Terminal MC4 Macho + Hembra (Par)', amount: 8, price: 3500 },
  connector_needed: { name: 'Conector Y Paralelo MC4 2 a 1', amount: 4, price: 8500 },
  vehicle_cable_needed: { name: 'Cable Vehicular Flexible AWG 2/0 (Rojo + Negro)', amount: 10, price: 8500 },
  electric_materials_needed: { name: 'Kit Material Eléctrico Completo (tubo, curvas, abrazaderas)', amount: 1, price: 125000 },
  ground_security_kit_needed: { name: 'Kit Puesta a Tierra con Varilla Copperweld', amount: 1, price: 95000 },
  rack_bateria: { name: 'Rack Metálico para Baterías 2 Niveles', amount: 1, price: 280000 },
  inversor: { name: 'Inversor Cargador Off-Grid 5000W 48V Onda Pura Puro', amount: 1, price: 2500000 },
}

const mockQuoteItems = [
  { product_id: 1, name: 'Panel Solar Monocristalino 550W 144 Células PERC Alta Eficiencia', amount: 4, hours: 6, price: 850000, subtotal: 3400000, category_name: 'Paneles Solares' },
  { product_id: 2, name: 'Batería de Litio LFP 200Ah 51.2V con BMS Integrado y App', amount: 2, hours: 24, price: 3200000, subtotal: 6400000, category_name: 'Baterías y Almacenamiento' },
  { product_id: 3, name: 'Inversor Cargador Off-Grid 5000W 48V Onda Pura Puro PWM', amount: 1, hours: 24, price: 2500000, subtotal: 2500000, category_name: 'Inversores' },
  { product_id: 4, name: 'Regulador de Carga MPPT 100A 48V con Display LCD y Bluetooth Integrado', amount: 1, hours: 24, price: 580000, subtotal: 580000, category_name: 'Reguladores' },
  { product_id: 5, name: 'Estructura Triangular Soporte Techo Inclinado para Panel Solar Regulable', amount: 4, hours: 0, price: 165000, subtotal: 660000, category_name: 'Soportes' },
]

const mockUser = { name: 'Juan Carlos', email: 'juan@ejemplo.co', lastname: 'Mendoza Pérez' }

for (const { name: resName, width, height } of RESOLUTIONS) {
  test(`${resName} — sin overflow horizontal`, async ({ mount, page }) => {
    await page.setViewportSize({ width, height })
    const component = await mount(
      <div style={{ width: width < 1024 ? '100%' : `${width}px`, background: '#F4F9F2' }}>
        <div style={{ display: 'flex', justifyContent: width < 1024 ? 'stretch' : 'center' }}>
          <CotizadorPanel
            calculation={mockCalculation}
            quoteItems={mockQuoteItems}
            onRemoveRequirement={() => {}}
            onAddRequirement={() => {}}
            onRemoveItem={() => {}}
            onReset={() => {}}
            onSendPDF={() => {}}
            onExpand={() => {}}
            user={mockUser}
            removedRequirements={[]}
          />
        </div>
      </div>,
    )

    await page.waitForTimeout(500)

    await expectNoHorizontalOverflow(component)

    // Capture falla si hay overflow; snapshot se regenera con --update-snapshots
    await expect(component).toHaveScreenshot(`cotizador-panel-${resName}.png`)
  })
}

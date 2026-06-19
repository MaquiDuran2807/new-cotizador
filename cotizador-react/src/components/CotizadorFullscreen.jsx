import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { formatCurrency, formatNumber } from '../utils/formatCurrency.js'
import QuoteItem from './QuoteItem.jsx'
import PdfDownloadButton from './PdfDownloadButton.jsx'
import RequirementsPanel from './RequirementsPanel.jsx'

function computeConsumptionTotals(consumptions) {
  if (!consumptions || consumptions.length === 0) return null
  let totalHr = 0, totalDay = 0, totalLoss = 0, totalFinal = 0
  consumptions.forEach((c) => {
    totalHr += c.consumption_hr || 0
    totalDay += c.consumption_day || 0
    totalLoss += c.loss_consumption || 0
    totalFinal += c.total_consumption_day || 0
  })
  return { totalHr, totalDay, totalLoss, totalFinal }
}

export default function CotizadorFullscreen({
  calculation,
  quoteItems,
  onRemoveRequirement,
  onAddRequirement,
  onRemoveItem,
  onReset,
  user,
  onSendPDF,
  removedRequirements,
  onClose,
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  const totalNormal = (calculation?.total_final_basic || 0) + (calculation?.total_precios || 0)
  const totalPremium = (calculation?.total_final_premiun || 0) + (calculation?.total_precios || 0)
  const loading = calculation === null
  const consTotals = computeConsumptionTotals(calculation?.consumptions)
  const panelProd = calculation?.panel_needed?.production

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[999] flex items-start justify-center pt-4 pb-4 overflow-y-auto"
    >
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-surface border-[1.5px] border-border rounded-3xl overflow-hidden w-[95vw] max-w-[1200px] max-h-[95vh] shadow-[0_32px_80px_rgba(13,27,9,0.30)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b-[1.5px] border-border-2">
          <div>
            <div className="text-[0.68rem] font-bold text-green-dark tracking-widest uppercase flex items-center gap-1.5 mb-1">
              Cotizador inteligente
            </div>
            <h2 className="font-num text-xl lg:text-2xl font-extrabold text-ink tracking-tight">Tu presupuesto solar</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="bg-[#FEF2F2] border-[1.5px] border-[#FCA5A5] text-[#DC2626] font-display font-bold text-xs rounded-xl px-3.5 py-2 cursor-pointer transition-all duration-[0.22s] hover:bg-[#FEE2E2]"
            >
              Reiniciar
            </button>
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-full bg-surface-2 border-[1.5px] border-border flex items-center justify-center cursor-pointer hover:bg-green hover:border-green hover:text-white transition-all duration-[0.22s]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-2 border-[1.5px] border-border rounded-2xl p-5">
                  <div className="text-[0.68rem] font-semibold text-text-3 uppercase tracking-wider mb-2">
                    <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Estándar
                  </div>
                  <div className="font-num text-2xl lg:text-3xl font-extrabold text-green-dark tracking-tight leading-none">
                    {loading ? '...' : formatCurrency(totalNormal)}
                  </div>
                  <div className="text-[0.62rem] text-text-3 italic mt-1">Sistema básico</div>
                </div>
                <div className="bg-surface-2 border-[1.5px] border-border rounded-2xl p-5">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-wider mb-2" style={{ color: '#7C3AED', opacity: 0.8 }}>
                    <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Llave en mano
                  </div>
                  <div className="font-num text-2xl lg:text-3xl font-extrabold tracking-tight leading-none" style={{ color: '#7C3AED' }}>
                    {loading ? '...' : formatCurrency(totalPremium)}
                  </div>
                  <div className="text-[0.62rem] text-text-3 italic mt-1">Sistema completo</div>
                </div>
              </div>

              {consTotals && !loading && (
                <div className="bg-surface-2 border-[1.5px] border-border rounded-2xl p-5">
                  <div className="text-[0.68rem] font-semibold text-text-3 uppercase tracking-wider mb-3">
                    Resumen de consumo
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <div className="text-[0.62rem] text-text-3">Consumo diario</div>
                      <div className="font-num font-bold text-ink text-sm">{formatNumber(consTotals.totalDay)} Wh/día</div>
                    </div>
                    <div>
                      <div className="text-[0.62rem] text-text-3">Pérdidas ({calculation?.consumptions?.[0]?.loss_percentaje || 0}%)</div>
                      <div className="font-num font-bold text-ink text-sm">{formatNumber(consTotals.totalLoss)} Wh/día</div>
                    </div>
                    <div>
                      <div className="text-[0.62rem] text-text-3">Total requerido</div>
                      <div className="font-num font-bold text-green-dark text-sm">{formatNumber(consTotals.totalFinal)} Wh/día</div>
                    </div>
                    {panelProd && (
                      <div>
                        <div className="text-[0.62rem] text-text-3">Generación ({calculation?.panel_needed?.name})</div>
                        <div className="font-num font-bold text-premium text-sm">{formatNumber(panelProd.total_production_day)} Wh/día</div>
                      </div>
                    )}
                  </div>
                  {panelProd && (
                    <div className="mt-3 pt-3 border-t-[1.5px] border-border-2">
                      <span className="text-[0.62rem] text-text-3">Paneles necesarios: </span>
                      <span className="font-num font-bold text-ink text-sm">{calculation?.panel_needed?.amount} UND</span>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-surface-2 border-[1.5px] border-border rounded-2xl p-5">
                <div className="text-[0.68rem] font-semibold text-text-3 uppercase tracking-wider mb-3">
                  Productos agregados ({quoteItems.length})
                </div>
                {loading && quoteItems.length === 0 && (
                  <div className="text-center py-6 text-text-3 text-xs">
                    Aún no has agregado productos.
                  </div>
                )}
                {!loading && quoteItems.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {quoteItems.map((item) => (
                      <QuoteItem key={item.product_id} item={item} onRemove={onRemoveItem} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <RequirementsPanel
                requirements={calculation}
                removedRequirements={removedRequirements}
                onRemoveRequirement={onRemoveRequirement}
                onAddRequirement={onAddRequirement}
              />

              {user && (
                <PdfDownloadButton onClick={() => onSendPDF(user)} compact />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CotizadorFullscreen.propTypes = {
  calculation: PropTypes.object,
  quoteItems: PropTypes.array.isRequired,
  onRemoveRequirement: PropTypes.func,
  onAddRequirement: PropTypes.func,
  onRemoveItem: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    lastname: PropTypes.string,
  }),
  onSendPDF: PropTypes.func.isRequired,
  removedRequirements: PropTypes.array,
  onClose: PropTypes.func.isRequired,
}

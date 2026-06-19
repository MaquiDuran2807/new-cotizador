import PropTypes from 'prop-types'
import { formatCurrency, formatNumber } from '../utils/formatCurrency.js'
import QuoteItem from './QuoteItem.jsx'
import RequirementsPanel from './RequirementsPanel.jsx'
import PdfDownloadButton from './PdfDownloadButton.jsx'
import Spinner from './ui/Spinner.jsx'

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

export default function CotizadorPanel({
  calculation,
  quoteItems,
  onRemoveRequirement,
  onAddRequirement,
  onReset,
  user,
  onRemoveItem,
  onSendPDF,
  removedRequirements,
  expanded,
  onExpand,
}) {
  const totalNormal = (calculation?.total_final_basic || 0) + (calculation?.total_precios || 0)
  const totalPremium = (calculation?.total_final_premiun || 0) + (calculation?.total_precios || 0)
  const loading = calculation === null
  const consTotals = computeConsumptionTotals(calculation?.consumptions)
  const panelProd = calculation?.panel_needed?.production

  return (
    <div className="w-full lg:w-[440px] flex-shrink-0">
      <div className="bg-surface border-[1.5px] border-border rounded-2xl shadow-[0_4px_20px_rgba(13,27,9,0.10)] overflow-x-hidden">
      <div className="p-2 lg:p-6 border-b-[1.5px] border-border-2">
        <div className="flex items-center justify-between">
          <div className="text-[0.6rem] lg:text-[0.68rem] font-bold text-green-dark tracking-widest uppercase flex items-center gap-1.5 mb-1">
            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Cotizador inteligente
          </div>
          <button
            onClick={() => onExpand(true)}
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-surface-2 border-[1.5px] border-border flex items-center justify-center cursor-pointer hover:bg-green hover:border-green hover:text-white transition-all duration-[0.22s] group"
            title="Ampliar cotizador"
          >
            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
        <h4 className="font-num text-base lg:text-xl font-extrabold text-ink tracking-tight">Tu presupuesto solar</h4>
        <p className="text-[0.65rem] lg:text-xs text-text-3 mt-1">Agrega productos para obtener tu cotización al instante</p>
      </div>

      <div className="grid grid-cols-2 gap-[1px] bg-border">
        <div className="bg-surface p-1.5 lg:p-5">
          <div className="text-[0.55rem] lg:text-[0.68rem] font-semibold text-text-3 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <svg className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Estándar
          </div>
          <div className="font-num text-base lg:text-2xl font-extrabold text-green-dark tracking-tight leading-tight">
            {loading ? '...' : formatCurrency(totalNormal)}
          </div>
          <div className="text-[0.5rem] lg:text-[0.62rem] text-text-3 italic">Sistema básico</div>
        </div>
        <div className="bg-surface p-1.5 lg:p-5">
          <div className="text-[0.55rem] lg:text-[0.68rem] font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1" style={{ color: '#7C3AED', opacity: 0.8 }}>
            <svg className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Llave en mano
          </div>
          <div className="font-num text-base lg:text-2xl font-extrabold tracking-tight leading-tight" style={{ color: '#7C3AED' }}>
            {loading ? '...' : formatCurrency(totalPremium)}
          </div>
          <div className="text-[0.5rem] lg:text-[0.62rem] text-text-3 italic">Sistema completo</div>
        </div>
      </div>

      {consTotals && !loading && (
        <div className="border-b-[1.5px] border-border-2">
          <div className="p-2 lg:p-5">
            <div className="text-[0.6rem] lg:text-[0.68rem] font-semibold text-text-3 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <svg className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Resumen de consumo
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-text-3 text-[0.65rem] lg:text-xs">Consumo diario</span>
                <span className="font-num font-bold text-ink text-[0.65rem] lg:text-xs">{formatNumber(consTotals.totalDay)} Wh/día</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-3 text-[0.65rem] lg:text-xs">Pérdidas ({calculation?.consumptions?.[0]?.loss_percentaje || 0}%)</span>
                <span className="font-num font-bold text-ink text-[0.65rem] lg:text-xs">{formatNumber(consTotals.totalLoss)} Wh/día</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-3 text-[0.65rem] lg:text-xs">Total requerido</span>
                <span className="font-num font-bold text-green-dark text-[0.65rem] lg:text-xs">{formatNumber(consTotals.totalFinal)} Wh/día</span>
              </div>
              {panelProd && (
                <>
                  <div className="border-t-[1.5px] border-border-2 my-1.5" />
                  <div className="flex justify-between items-center">
                    <span className="text-text-3 text-[0.65rem] lg:text-xs">Generación panel ({calculation?.panel_needed?.name})</span>
                    <span className="font-num font-bold text-premium text-[0.65rem] lg:text-xs">{formatNumber(panelProd.total_production_day)} Wh/día</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-3 text-[0.65rem] lg:text-xs">Cantidad de paneles</span>
                    <span className="font-num font-bold text-ink text-[0.65rem] lg:text-xs">{calculation?.panel_needed?.amount} UND</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 p-2 lg:p-5 border-b-[1.5px] border-border-2">
        <select className="flex-1 bg-surface-2 border-[1.5px] border-border rounded-lg px-2 py-1.5 lg:px-3 lg:py-2 font-display text-[0.7rem] lg:text-xs text-text outline-none transition-colors duration-[0.22s] focus:border-green cursor-pointer">
          <option>¿Dónde te encuentras?</option>
          <option value="1">Cundinamarca</option>
          <option value="2">Boyacá</option>
          <option value="3">Resto del país</option>
        </select>
        <button
          onClick={onReset}
          className="bg-[#FEF2F2] border-[1.5px] border-[#FCA5A5] text-[#DC2626] font-display font-bold text-[0.7rem] lg:text-xs rounded-lg px-2 py-1.5 lg:px-3 lg:py-2 cursor-pointer whitespace-nowrap transition-all duration-[0.22s] hover:bg-[#FEE2E2] hover:border-[#F87171]"
        >
          <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reiniciar
        </button>
      </div>

      <div className="p-2 lg:p-5 flex flex-col gap-2 min-h-[80px]">
        {loading && <Spinner />}

        {!loading && quoteItems.length === 0 && (
          <div className="text-center py-4 text-text-3 text-[0.7rem]">
            <svg className="w-6 h-6 mx-auto mb-1 text-green-mid" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            Aún no has agregado productos.<br />Selecciona uno para comenzar.
          </div>
        )}

        {!loading &&
          quoteItems.map((item) => (
            <QuoteItem key={item.product_id} item={item} onRemove={onRemoveItem} compact />
          ))}
      </div>

      <RequirementsPanel
        requirements={calculation}
        removedRequirements={removedRequirements}
        onRemoveRequirement={onRemoveRequirement}
        onAddRequirement={onAddRequirement}
        compact
      />

      {user && (
        <div className="p-3 lg:p-5 pt-2 flex justify-center">
          <PdfDownloadButton onClick={() => onSendPDF(user)} compact={true} />
      </div>
      )}
    </div>
    </div>
  )
}

CotizadorPanel.propTypes = {
  calculation: PropTypes.object,
  quoteItems: PropTypes.array.isRequired,
  onRemoveRequirement: PropTypes.func.isRequired,
  onAddRequirement: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    lastname: PropTypes.string,
  }),
  onSendPDF: PropTypes.func.isRequired,
  removedRequirements: PropTypes.arrayOf(PropTypes.string),
  expanded: PropTypes.bool,
  onExpand: PropTypes.func,
}
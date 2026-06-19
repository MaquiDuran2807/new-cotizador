import PropTypes from 'prop-types'
import { formatNumber } from '../utils/formatCurrency.js'

export default function QuoteItem({ item, onRemove }) {
  return (
    <div className="bg-surface-2 border-[1.5px] border-border-2 rounded-xl p-3 text-xs relative">
      <div className="mb-1.5 pr-5">
        <span className="font-semibold text-text text-sm leading-tight block">{item.name}</span>
        <button
          onClick={() => onRemove(item.product_id)}
          className="absolute top-2 right-2 text-[#DC2626] opacity-50 hover:opacity-100 cursor-pointer bg-transparent border-none transition-opacity duration-[0.22s] p-0.5"
          title="Eliminar"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1">
        <div className="text-center">
          <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider">Precio U.</div>
          <div className="font-num font-bold text-text">${formatNumber(item.price)}</div>
        </div>
        <div className="text-center">
          <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider">Cantidad</div>
          <div className="font-num font-bold text-text">{item.amount}</div>
        </div>
        <div className="text-center">
          <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider">Horas</div>
          <div className="font-num font-bold text-text">{item.hours}h</div>
        </div>
      </div>
      {item.consumption_hr != null && (
        <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider">Cons/h</div>
            <div className="font-num font-bold text-text text-[0.7rem]">{formatNumber(item.consumption_hr)} W</div>
          </div>
          <div className="text-center">
            <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider">Cons/día</div>
            <div className="font-num font-bold text-text text-[0.7rem]">{formatNumber(item.consumption_day)} W</div>
          </div>
          <div className="text-center">
            <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider">Total</div>
            <div className="font-num font-bold text-text text-[0.7rem]">{formatNumber(item.total_consumption)} W</div>
          </div>
        </div>
      )}
    </div>
  )
}

QuoteItem.propTypes = {
  item: PropTypes.shape({
    product_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number,
    amount: PropTypes.number.isRequired,
    hours: PropTypes.number,
    consumption_hr: PropTypes.number,
    consumption_day: PropTypes.number,
    total_consumption: PropTypes.number,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
}

import { useState } from 'react'
import PropTypes from 'prop-types'
import Button from './ui/Button.jsx'
import ProductModal from './ProductModal.jsx'

const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23EBF5E7" width="400" height="300"/%3E%3Ctext fill="%238A9E82" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESin imagen%3C/text%3E%3C/svg%3E'

export default function ProductCard({ product, onAdd, onRemove, quoteItem }) {
  const [hours, setHours] = useState(product.tiempo_uso || 24)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const inQuote = Boolean(quoteItem)

  const pct = ((hours - 1) / 23) * 100

  return (
    <>
      <div
        className="bg-surface border-[1.5px] border-border rounded-2xl overflow-hidden flex flex-col relative transition-all duration-[0.3s] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-green hover:shadow-[0_12px_40px_rgba(13,27,9,0.14),0_0_0_1px_#C2F0B8] hover:-translate-y-1"
        style={{ animation: 'cardIn 0.4s ease both' }}
      >
        <div className="h-[210px] bg-surface-2 border-b-[1.5px] border-border flex items-center justify-center overflow-hidden relative">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 animate-pulse bg-[#E8FAE4] flex items-center justify-center">
              <svg className="w-10 h-10 text-text-3/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <img
            src={imgError ? PLACEHOLDER : product.image}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgLoaded(true); setImgError(true) }}
            className={`max-h-[170px] max-w-[90%] object-contain transition-transform duration-[0.4s] ${
              imgLoaded ? 'opacity-100' : 'opacity-0 absolute'
            }`}
          />
          <div className="absolute top-2.5 right-2.5 bg-green text-white text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Solar
          </div>
        </div>

        <div className="p-5 lg:p-6 flex-1 flex flex-col gap-3">
          <h3 className="font-num text-sm lg:text-base font-bold text-ink leading-tight min-h-[2.5em]">
            {product.name.length > 25
              ? product.name.slice(0, 25) + '…'
              : product.name}
          </h3>
          <div className="font-num text-xl lg:text-2xl font-extrabold text-green-dark tracking-tight leading-none min-h-[2.5rem] flex items-end">
            $ {product.price?.toLocaleString('es-CO')}{' '}
            <small className="text-[0.68rem] font-medium text-text-3">COP</small>
          </div>
          <p className="text-xs text-text-2 leading-relaxed line-clamp-2">{product.description}</p>

          <button
            onClick={() => setShowModal(true)}
            className="text-green-dark font-display font-bold text-xs bg-green-light border-[1.5px] border-green-mid rounded-full px-3 py-1.5 self-start cursor-pointer hover:bg-green hover:text-white hover:border-green transition-all duration-[0.22s]"
          >
            Ver más
          </button>

          <div className="bg-surface-2 border-[1.5px] border-border-2 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[0.72rem] font-semibold text-text-2">Horas de uso diario</span>
              <strong className="font-num text-sm font-extrabold text-green-dark bg-green-light border-[1.5px] border-green-mid px-2 py-0.5 rounded-full min-w-[46px] text-center">
                {hours}
              </strong>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              style={{ '--pct': `${pct}%` }}
            />
          </div>

          <div className="flex gap-2 mt-2">
            <Button variant="danger" onClick={() => onRemove(product.id)} className="flex-1 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar
            </Button>
            <Button variant="success" onClick={(e) => onAdd(product, hours, e)} className="flex-1 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {inQuote ? 'Actualizar' : 'Agregar'}
            </Button>
          </div>
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={product}
          hours={hours}
          onAdd={onAdd}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    tiempo_uso: PropTypes.number,
    category_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  quoteItem: PropTypes.shape({
    product_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    amount: PropTypes.number,
    hours: PropTypes.number,
  }),
}

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Button from './ui/Button.jsx'

const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23EBF5E7" width="400" height="300"/%3E%3Ctext fill="%238A9E82" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ESin imagen%3C/text%3E%3C/svg%3E'

export default function ProductModal({ product, hours, onAdd, onClose }) {
  const [visible, setVisible] = useState(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-surface border-[1.5px] border-border rounded-3xl overflow-hidden w-full max-w-[960px] max-h-[85vh] shadow-[0_32px_80px_rgba(13,27,9,0.30)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border-[1.5px] border-border flex items-center justify-center cursor-pointer hover:bg-green hover:border-green hover:text-white transition-all duration-[0.22s]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row max-h-[85vh] overflow-y-auto">
          <div className="md:w-1/2 h-[260px] md:h-auto md:min-h-[500px] bg-surface-2 border-b-[1.5px] md:border-b-0 md:border-r-[1.5px] border-border flex items-center justify-center overflow-hidden relative flex-shrink-0">
            <img
              src={imgError ? PLACEHOLDER : product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="max-h-[220px] md:max-h-[420px] max-w-[90%] object-contain"
            />
            <div className="absolute top-4 left-4 bg-green text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Solar
            </div>
          </div>

          <div className="md:w-1/2 p-6 lg:p-8 flex flex-col gap-5 overflow-y-auto">
            <div>
              <h2 className="font-num text-xl lg:text-2xl font-extrabold text-ink tracking-tight">{product.name}</h2>
              <div className="font-num text-2xl lg:text-3xl font-extrabold text-green-dark tracking-tight leading-none mt-2">
                $ {product.price?.toLocaleString('es-CO')}{' '}
                <small className="text-[0.7rem] font-medium text-text-3">COP</small>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-2 border-[1.5px] border-border-2 rounded-xl p-3 text-center">
                <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider">Consumo</div>
                <div className="font-num font-extrabold text-ink text-sm mt-0.5">{product.consume ?? '-'} W</div>
              </div>
              {product.category_name && (
                <div className="bg-surface-2 border-[1.5px] border-border-2 rounded-xl p-3 text-center">
                  <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider">Categoría</div>
                  <div className="font-semibold text-text text-sm mt-0.5">{product.category_name}</div>
                </div>
              )}
            </div>

            {product.caracteristicas && (
              <div className="bg-surface-2 border-[1.5px] border-border-2 rounded-xl p-3">
                <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-1">Características</div>
                <div className="font-semibold text-text text-sm">{product.caracteristicas}</div>
              </div>
            )}

            <div>
              <h4 className="text-[0.68rem] font-bold text-text-3 uppercase tracking-wider mb-2">Descripción</h4>
              <p className="text-sm text-text-2 leading-relaxed">{product.description}</p>
            </div>

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
                readOnly
                className="w-full opacity-60"
              />
            </div>

            <div className="flex gap-3 pt-2 mt-auto">
              <Button variant="outline" onClick={handleClose} className="flex-1 text-xs">
                Cerrar
              </Button>
              <Button variant="success" onClick={() => { onAdd(product, hours); handleClose() }} className="flex-1 text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar al cotizador
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ProductModal.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    consume: PropTypes.number,
    caracteristicas: PropTypes.string,
    category_name: PropTypes.string,
  }).isRequired,
  hours: PropTypes.number,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

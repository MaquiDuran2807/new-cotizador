import { useState } from 'react'
import PropTypes from 'prop-types'
import { formatNumber } from '../utils/formatCurrency.js'

const CATEGORIZED = [
  { key: 'regulator_needed', label: '🔌 Reguladores' },
  { key: 'panel_needed', label: '☀️ Paneles' },
  { key: 'battery_needed', label: '🔋 Baterías' },
  { key: 'breaker_needed', label: '⚡ Breakers' },
]

const OTHER_REQUIREMENTS = [
  'rubberized_cable_needed',
  'panel_support_needed',
  'centralized_modules_needed',
  'power_units_needed',
  'terminals_needed',
  'connector_needed',
  'vehicle_cable_needed',
  'electric_materials_needed',
  'ground_security_kit_needed',
  'rack_bateria',
  'inversor',
]

const OTHER_LABELS = {
  rubberized_cable_needed: 'Cables',
  panel_support_needed: 'Soporte techo',
  centralized_modules_needed: 'Módulo Central',
  power_units_needed: 'Unidad Potencia',
  terminals_needed: 'Term. MC4',
  connector_needed: 'Conect. Y',
  vehicle_cable_needed: 'Cable Vehic.',
  electric_materials_needed: 'Mat. Eléctricos',
  ground_security_kit_needed: 'Kit Tierra',
  rack_bateria: 'Rack Bat.',
  inversor: 'Inversores',
}

function ReqSection({ title, requirement, reqKey, onRemove, onAdd, removed }) {
  const [open, setOpen] = useState(false)

  if (!requirement) return null

  return (
    <div className="border-[1.5px] border-border-2 rounded-xl overflow-hidden mb-2 mx-0">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full bg-surface-2 border-none px-4 py-3 font-display font-semibold text-xs text-text cursor-pointer text-left flex items-center justify-between transition-colors duration-[0.22s] hover:bg-green-light hover:text-green-dark ${open ? 'bg-green-light text-green-dark' : ''}`}
      >
        <span className="flex items-center gap-1.5">{title}</span>
        <svg className={`w-3 h-3 text-text-3 transition-transform duration-[0.22s] ${open ? 'rotate-180 text-green-dark' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="bg-surface px-4 pb-3 pt-2.5" style={{ animation: 'fadeIn 0.18s ease' }}>
          <div className="grid grid-cols-[1.8fr_2fr_1.8fr_0.6fr] gap-1.5 items-start py-1.5 text-[0.75rem] border-t border-border-2 first:border-t-0">
            <div>
              <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5">Cant.</div>
              <span className="font-semibold text-text">{requirement.amount || 0}</span>
            </div>
            <div>
              <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5">Tipo</div>
              <span className="text-text">{requirement.name || '-'}</span>
            </div>
            <div>
              <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5">P/Total</div>
              <span className="font-num font-bold text-green-dark">
                ${formatNumber((requirement.price || 0) * (requirement.amount || 0))}
              </span>
            </div>
            <div className="flex items-start justify-center pt-4">
              {removed ? (
                <button onClick={() => onAdd(reqKey)} className="text-green cursor-pointer bg-transparent border-none text-sm opacity-70 hover:opacity-100 transition-opacity" title="Reagregar">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              ) : (
                <button onClick={() => onRemove(reqKey)} className="text-[#DC2626] cursor-pointer bg-transparent border-none text-sm opacity-50 hover:opacity-100 transition-opacity" title="Eliminar">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

ReqSection.propTypes = {
  title: PropTypes.string.isRequired,
  requirement: PropTypes.object,
  reqKey: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  removed: PropTypes.bool,
}

export default function RequirementsPanel({ requirements, removedRequirements, onRemoveRequirement, onAddRequirement }) {
  if (!requirements) return null

  return (
    <div className="pt-2">
      {CATEGORIZED.map(({ key, label }) => (
        <ReqSection
          key={key}
          title={label}
          requirement={requirements[key]}
          reqKey={key}
          onRemove={onRemoveRequirement}
          onAdd={onAddRequirement}
          removed={removedRequirements?.includes(key)}
        />
      ))}

      <div className="border-[1.5px] border-border-2 rounded-xl overflow-hidden mb-2 mx-0">
        <details className="group" open>
          <summary className="w-full bg-surface-2 border-none px-4 py-3 font-display font-semibold text-xs text-text cursor-pointer text-left flex items-center justify-between hover:bg-green-light hover:text-green-dark transition-colors duration-[0.22s] list-none">
            <span className="flex items-center gap-1.5">🛠️ Otros requerimientos</span>
            <svg className="w-3 h-3 text-text-3 transition-transform duration-[0.22s] group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="bg-surface px-4 pb-3 pt-2.5">
            {OTHER_REQUIREMENTS.map((key) => {
              const req = requirements[key]
              if (!req) return null
              return (
                <div key={key} className="grid grid-cols-[1.8fr_2fr_1.8fr_0.6fr] gap-1.5 items-start py-1.5 text-[0.75rem] border-t border-border-2 first:border-t-0">
                  <div>
                    <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5">{OTHER_LABELS[key] || key}</div>
                    <span className="font-semibold text-text">{req.amount || 0}</span>
                  </div>
                  <div>
                    <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5">Tipo</div>
                    <span className="text-text">{req.name || '-'}</span>
                  </div>
                  <div>
                    <div className="text-[0.6rem] font-bold text-text-3 uppercase tracking-wider mb-0.5">P/Unit</div>
                    <span className="font-num text-text">${formatNumber(req.price || 0)}</span>
                  </div>
                  <div className="flex items-start justify-center pt-4">
                    {removedRequirements?.includes(key) ? (
                      <button onClick={() => onAddRequirement(key)} className="text-green cursor-pointer bg-transparent border-none text-sm opacity-70 hover:opacity-100" title="Reagregar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    ) : (
                      <button onClick={() => onRemoveRequirement(key)} className="text-[#DC2626] cursor-pointer bg-transparent border-none text-sm opacity-50 hover:opacity-100" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </details>
      </div>
    </div>
  )
}

RequirementsPanel.propTypes = {
  requirements: PropTypes.object,
  removedRequirements: PropTypes.arrayOf(PropTypes.string),
  onRemoveRequirement: PropTypes.func.isRequired,
  onAddRequirement: PropTypes.func.isRequired,
}

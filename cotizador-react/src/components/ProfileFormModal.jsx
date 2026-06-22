import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { updateCurrentUser, fetchDepartments, fetchMunicipalities } from '../services/api.js'

const COLOMBIAN_PHONE_RE = /^3\d{9}$/

export default function ProfileFormModal({ user, onDownload, onClose }) {
  const [visible, setVisible] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef(null)

  const [name, setName] = useState(user?.name || '')
  const [lastname, setLastname] = useState(user?.lastname || '')
  const [telephone, setTelephone] = useState(String(user?.telephone ?? ''))
  const [departments, setDepartments] = useState([])
  const [municipalities, setMunicipalities] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState(user?.department_id ?? '')
  const [selectedCity, setSelectedCity] = useState(user?.city_id ?? '')

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedDepartment) {
      fetchMunicipalities(selectedDepartment).then(setMunicipalities).catch(() => {})
    } else {
      setMunicipalities([])
    }
  }, [selectedDepartment])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  const validatePhone = (num) => COLOMBIAN_PHONE_RE.test(num)

  const handleDownload = async () => {
    setError('')
    if (!name.trim() || !lastname.trim()) {
      setError('Nombre y apellido son obligatorios')
      return
    }
    const phoneStr = telephone.replace(/\D/g, '')
    if (!phoneStr || !validatePhone(phoneStr)) {
      setError('El teléfono debe ser un celular colombiano de 10 dígitos que empiece por 3')
      return
    }
    if (!selectedDepartment) {
      setError('Selecciona tu departamento')
      return
    }
    if (!selectedCity) {
      setError('Selecciona tu ciudad')
      return
    }
    setSaving(true)
    try {
      const updated = await updateCurrentUser({
        name: name.trim(),
        lastname: lastname.trim(),
        telephone: Number(phoneStr),
        department_id: Number(selectedDepartment),
        city_id: Number(selectedCity),
      })
      setVisible(false)
      setTimeout(() => onDownload(updated), 250)
    } catch (err) {
      setError(err.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        ref={formRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-surface border-[1.5px] border-border rounded-3xl overflow-hidden w-full max-w-[460px] shadow-[0_32px_80px_rgba(13,27,9,0.30)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
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

        <div className="p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-surface-3 border-[1.5px] border-border flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="font-num text-lg font-extrabold text-ink tracking-tight">Tus datos</h2>
              <p className="text-[0.72rem] text-text-2 mt-0.5">Confirma tus datos antes de descargar</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[0.68rem] font-bold text-text-3 uppercase tracking-wider mb-1.5 block">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-2 border-[1.5px] border-border-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink outline-none focus:border-green transition-colors duration-[0.22s]"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="text-[0.68rem] font-bold text-text-3 uppercase tracking-wider mb-1.5 block">Apellido</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full bg-surface-2 border-[1.5px] border-border-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink outline-none focus:border-green transition-colors duration-[0.22s]"
                placeholder="Tu apellido"
              />
            </div>

            <div>
              <label className="text-[0.68rem] font-bold text-text-3 uppercase tracking-wider mb-1.5 block">Teléfono celular</label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full bg-surface-2 border-[1.5px] border-border-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink outline-none focus:border-green transition-colors duration-[0.22s]"
                placeholder="3001234567"
                maxLength={10}
              />
            </div>

            <div>
              <label className="text-[0.68rem] font-bold text-text-3 uppercase tracking-wider mb-1.5 block">Departamento</label>
              <select
                value={selectedDepartment}
                onChange={(e) => { setSelectedDepartment(e.target.value); setSelectedCity('') }}
                className="w-full bg-surface-2 border-[1.5px] border-border-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink outline-none focus:border-green transition-colors duration-[0.22s] appearance-none"
              >
                <option value="">Selecciona un departamento</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[0.68rem] font-bold text-text-3 uppercase tracking-wider mb-1.5 block">Ciudad</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedDepartment}
                className="w-full bg-surface-2 border-[1.5px] border-border-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink outline-none focus:border-green transition-colors duration-[0.22s] appearance-none disabled:opacity-50"
              >
                <option value="">Selecciona una ciudad</option>
                {municipalities.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-surface-2 border-[1.5px] border-border-2 rounded-xl p-3 flex items-center gap-2.5">
              <svg className="w-4 h-4 text-text-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[0.72rem] text-text-2">{user?.email}</span>
            </div>

            {error && (
              <div className="bg-red-50 border-[1.5px] border-red-200 rounded-xl px-4 py-2.5">
                <span className="text-[0.72rem] font-semibold text-red-600">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-surface-2 hover:bg-surface-3 border-[1.5px] border-border-2 text-text-2 font-bold text-sm py-3 rounded-xl transition-all duration-[0.22s] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={saving}
                className="flex-1 bg-green hover:bg-green-dark disabled:opacity-50 text-white font-bold text-sm py-3 rounded-xl transition-all duration-[0.22s] cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ProfileFormModal.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    telephone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    department_id: PropTypes.number,
    city_id: PropTypes.number,
  }),
  onDownload: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

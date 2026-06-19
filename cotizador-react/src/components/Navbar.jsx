import { useState } from 'react'
import PropTypes from 'prop-types'
import logoSvg from '../assets/images/LOGO PNG 1.png'

export default function Navbar({ onLogout, onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <div className="bg-green text-[#0D1B09] overflow-hidden h-[34px] flex items-center">
        <div
          className="flex gap-20 whitespace-nowrap text-[0.78rem] font-semibold tracking-wide"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          <span>⚡ 20% OFF en Paneles Solares · 🧊 15% OFF en Neveras · 📦 5% OFF en Kits Completos · 🎁 +5% extra por registro en Policristalinos</span>
          <span>⚡ 20% OFF en Paneles Solares · 🧊 15% OFF en Neveras · 📦 5% OFF en Kits Completos · 🎁 +5% extra por registro en Policristalinos</span>
        </div>
      </div>

      <nav
        className="sticky top-0 z-200 bg-surface border-b-[1.5px] border-border px-4 lg:px-4 py-2 flex items-center gap-2 md:gap-8 shadow-[0_2px_8px_rgba(13,27,9,0.08)]"
        style={{ animation: 'slideDown 0.5s ease both' }}
      >
        <a href="#" className="flex items-center gap-1.5 md:gap-2.5 no-underline flex-shrink-0 min-w-0 max-w-full">
          <img src={logoSvg} alt="CodenSolar" className="h-10 md:h-16 w-auto max-w-[100px] md:max-w-none" />
          <span className="font-num font-extrabold text-lg md:text-xl text-ink tracking-tight whitespace-nowrap">
            Coden<em className="text-green not-italic">Solar</em>
          </span>
        </a>

        <div className="hidden sm:flex flex-1 max-w-[200px] lg:max-w-[360px] items-center gap-2 bg-surface-2 border-[1.5px] border-border rounded-full px-4 py-1.5 transition-all duration-[0.22s] focus-within:border-green focus-within:bg-surface focus-within:shadow-[0_0_0_3px_rgba(64,201,42,0.15)]">
          <svg className="w-3.5 h-3.5 text-text-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="search" placeholder="Buscar paneles, neveras, kits…" onChange={(e) => onSearch?.(e.target.value)} className="bg-transparent border-none outline-none text-text text-sm w-full min-w-0 font-display placeholder:text-text-3" />
        </div>

        <div className="hidden md:flex items-center gap-0.5 ml-auto">
          <a href="#" className="text-text-2 text-sm font-medium px-3 py-1.5 rounded-xl hover:text-green hover:bg-green-light transition-all duration-[0.22s] no-underline">
            Inicio
          </a>
          <a href="#" className="text-text-2 text-sm font-medium px-3 py-1.5 rounded-xl hover:text-green hover:bg-green-light transition-all duration-[0.22s] no-underline">
            Servicios
          </a>
          <a href="#" className="text-text-2 text-sm font-medium px-3 py-1.5 rounded-xl hover:text-green hover:bg-green-light transition-all duration-[0.22s] no-underline">
            Blog
          </a>
          <a href="#" className="text-text-2 text-sm font-medium px-3 py-1.5 rounded-xl hover:text-green hover:bg-green-light transition-all duration-[0.22s] no-underline">
            Contacto
          </a>
          <button
            onClick={onLogout}
            className="font-display font-bold text-xs bg-green text-white border-none rounded-full px-5 py-1.5 cursor-pointer tracking-wide transition-all duration-[0.22s] hover:bg-green-dark hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(64,201,42,0.25)] ml-2"
          >
            Salir
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-surface-2 border-[1.5px] border-border cursor-pointer ml-auto flex-shrink-0"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <svg className="w-5 h-5 text-text-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-300 bg-black/20 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="fixed top-[calc(34px+57px)] right-0 z-400 w-56 bg-surface border-[1.5px] border-border rounded-2xl shadow-[0_8px_32px_rgba(13,27,9,0.18)] p-3 md:hidden"
            style={{ animation: 'slideDown 0.25s ease both' }}
          >
            <div className="sm:hidden mb-2">
              <div className="flex items-center gap-2 bg-surface-2 border-[1.5px] border-border rounded-full px-4 py-1.5 transition-all duration-[0.22s] focus-within:border-green">
                <svg className="w-3.5 h-3.5 text-text-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="search" placeholder="Buscar…" onChange={(e) => onSearch?.(e.target.value)} className="bg-transparent border-none outline-none text-text text-sm w-full min-w-0 font-display placeholder:text-text-3" />
              </div>
            </div>
            <a href="#" className="block text-text-2 text-sm font-medium px-3 py-2.5 rounded-xl hover:text-green hover:bg-green-light transition-all duration-[0.22s] no-underline">
              Inicio
            </a>
            <a href="#" className="block text-text-2 text-sm font-medium px-3 py-2.5 rounded-xl hover:text-green hover:bg-green-light transition-all duration-[0.22s] no-underline">
              Servicios
            </a>
            <a href="#" className="block text-text-2 text-sm font-medium px-3 py-2.5 rounded-xl hover:text-green hover:bg-green-light transition-all duration-[0.22s] no-underline">
              Blog
            </a>
            <a href="#" className="block text-text-2 text-sm font-medium px-3 py-2.5 rounded-xl hover:text-green hover:bg-green-light transition-all duration-[0.22s] no-underline">
              Contacto
            </a>
            <hr className="my-2 border-border" />
            <button
              onClick={onLogout}
              className="w-full font-display font-bold text-xs bg-green text-white border-none rounded-full px-5 py-2.5 cursor-pointer tracking-wide transition-all duration-[0.22s] hover:bg-green-dark"
            >
              Salir
            </button>
          </div>
        </>
      )}
    </>
  )
}

Navbar.propTypes = {
  onLogout: PropTypes.func,
  onSearch: PropTypes.func,
}

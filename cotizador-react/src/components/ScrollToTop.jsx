import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-green border-[1.5px] border-green-mid shadow-[0_4px_16px_rgba(64,201,42,0.3)] flex items-center justify-center cursor-pointer transition-all duration-[0.22s] hover:bg-green-dark hover:shadow-[0_4px_20px_rgba(64,201,42,0.45)] hover:-translate-y-0.5 active:translate-y-0 animate-fadeIn"
      title="Volver arriba"
      aria-label="Volver arriba"
    >
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  )
}

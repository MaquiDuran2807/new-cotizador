import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

export default function FlyingElement({ startX, startY, targetRef, label, onComplete }) {
  const [endX, setEndX] = useState(startX)
  const [endY, setEndY] = useState(startY)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!targetRef?.current) { onComplete(); return }

    const targetRect = targetRef.current.getBoundingClientRect()
    setEndX(targetRect.left + targetRect.width / 2)
    setEndY(targetRect.top + targetRect.height / 2)

    requestAnimationFrame(() => setPhase(1))

    const flyTimer = setTimeout(() => {
      setPhase(2)
      setTimeout(onComplete, 800)
    }, 250)

    return () => clearTimeout(flyTimer)
  }, [startX, startY, targetRef, onComplete])

  let scale = 0, opacity = 0
  if (phase === 0) { scale = 0; opacity = 0 }
  else if (phase === 1) { scale = 1; opacity = 1 }
  else { scale = 0.2; opacity = 0.4 }

  const dx = endX - startX
  const dy = endY - startY
  const midX = startX + dx * 0.5
  const midY = startY + dy * 0.5 - 140

  const progress = phase >= 2 ? 1 : 0

  const cx = phase === 2 ? endX : startX
  const cy = phase === 2 ? endY : startY

  return createPortal(
    <div
      className="fixed pointer-events-none z-[9999] flex items-center justify-center"
      style={{
        left: startX,
        top: startY,
        transform: `translate(-50%, -50%) translate(${cx - startX}px, ${cy - startY}px) scale(${scale})`,
        opacity,
        transition: phase === 1
          ? 'all 220ms cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'all 800ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div className="w-16 h-16 rounded-full bg-green shadow-[0_0_40px_rgba(64,201,42,0.55)] flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>,
    document.body,
  )
}

FlyingElement.propTypes = {
  startX: PropTypes.number.isRequired,
  startY: PropTypes.number.isRequired,
  targetRef: PropTypes.shape({ current: PropTypes.object }),
  label: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
}

import PropTypes from 'prop-types'

const variants = {
  success:
    'bg-green text-white font-bold hover:bg-green-dark hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(64,201,42,0.25)] active:scale-[0.97]',
  danger:
    'bg-[#FEF2F2] text-[#DC2626] border-[1.5px] border-[#FCA5A5] hover:bg-[#FEE2E2] hover:border-[#F87171]',
  outline:
    'bg-transparent border-[1.5px] border-border text-text-2 hover:text-green hover:bg-green-light',
}

export default function Button({ children, variant = 'success', onClick, className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-display font-bold cursor-pointer transition-all duration-[0.22s] ease-[cubic-bezier(0.4,0,0.2,1)] border-none'
  return (
    <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['success', 'danger', 'outline']),
  onClick: PropTypes.func,
  className: PropTypes.string,
}

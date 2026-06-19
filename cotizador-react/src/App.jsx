import { useCallback, useEffect, useRef, useState } from 'react';
import CategoryFilter from './components/CategoryFilter.jsx';
import CotizadorFullscreen from './components/CotizadorFullscreen.jsx';
import CotizadorPanel from './components/CotizadorPanel.jsx';
import FlyingElement from './components/FlyingElement.jsx';
import Footer from './components/Footer.jsx';
import HeroCarousel from './components/HeroCarousel.jsx';
import Navbar from './components/Navbar.jsx';
import PdfDownloadButton from './components/PdfDownloadButton.jsx';
import ProductGallery from './components/ProductGallery.jsx';
import { calculateQuote, fetchCarouselSlides, fetchCurrentUser, fetchProducts, sendQuotePDF } from './services/api.js';

export default function App() {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [quoteItems, setQuoteItems] = useState([])
  const [calculation, setCalculation] = useState(null)
  const [removedRequirements, setRemovedRequirements] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [carouselSlides, setCarouselSlides] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [cotizadorExpanded, setCotizadorExpanded] = useState(false)
  const [flyingSrc, setFlyingSrc] = useState(null)
  const pendingRequest = useRef(null)
  const cotizadorRef = useRef(null)

  useEffect(() => {
    const productsEl = document.getElementById('products-data')
    const userEl = document.getElementById('user-data')
    if (productsEl) {
      try { setProducts(JSON.parse(productsEl.textContent)) } catch (e) { console.error('Error parsing products-data:', e) }
    } else {
      fetchProducts().then(setProducts).catch(console.error)
    }
    if (userEl) {
      try { setUser(JSON.parse(userEl.textContent)) } catch (e) { console.error('Error parsing user-data:', e) }
    }
    fetchCurrentUser().then(setUser).catch(() => {})
    fetchCarouselSlides().then(setCarouselSlides).catch(console.error)
  }, [])

  const fetchQuote = useCallback(async (items, removedReqs) => {
    if (pendingRequest.current) { pendingRequest.current.abort() }
    const controller = new AbortController()
    pendingRequest.current = controller
    try {
      const payload = items.map((item) => ({
        product_id: item.product_id,
        amount: item.amount,
        hours: item.hours,
        borrar: false,
        eliminar_requeimientos: removedReqs,
      }))
      if (payload.length === 0) { setCalculation(null); return }
      const result = await calculateQuote(payload)
      if (!controller.signal.aborted) { setCalculation(result) }
    } catch (err) {
      if (!controller.signal.aborted) { console.error('Error fetching quote:', err) }
    }
  }, [])

  useEffect(() => { fetchQuote(quoteItems, removedRequirements) }, [quoteItems, removedRequirements, fetchQuote])

  const doAddProduct = useCallback((product, hours) => {
    setQuoteItems((prev) => {
      const existing = prev.find((qi) => qi.product_id == product.id)
      if (existing) {
        return prev.map((qi) =>
          qi.product_id == product.id ? { ...qi, amount: qi.amount + 1, hours } : qi,
        )
      }
      return [...prev, { product_id: product.id, name: product.name, price: product.price, amount: 1, hours }]
    })
  }, [])

  const handleAddProduct = useCallback((product, hours, event) => {
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect()
      setFlyingSrc({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        product,
        hours,
      })
    } else {
      doAddProduct(product, hours)
    }
  }, [doAddProduct])

  const handleRemoveProduct = useCallback((productId) => {
    setQuoteItems((prev) => {
      const existing = prev.find((qi) => qi.product_id == productId)
      if (existing && existing.amount > 1) {
        return prev.map((qi) =>
          qi.product_id == productId ? { ...qi, amount: qi.amount - 1 } : qi,
        )
      }
      return prev.filter((qi) => qi.product_id != productId)
    })
  }, [])

  const handleRemoveItem = useCallback((productId) => {
    setQuoteItems((prev) => prev.filter((qi) => qi.product_id != productId))
  }, [])

  const handleRemoveRequirement = useCallback((reqName) => {
    setRemovedRequirements((prev) => prev.includes(reqName) ? prev : [...prev, reqName])
  }, [])

  const handleAddRequirement = useCallback((reqName) => {
    setRemovedRequirements((prev) => prev.filter((r) => r !== reqName))
  }, [])

  const handleReset = useCallback(() => {
    setQuoteItems([]); setCalculation(null); setRemovedRequirements([])
  }, [])

  const handleLogout = useCallback(() => {
    if (user) { window.location.href = '/user/logout' }
  }, [user])

  const handleSendPDF = useCallback(async (userData) => {
    if (!userData || !userData.email) {
      alert('Debes iniciar sesión para descargar la cotización en PDF.')
      return
    }
    try {
      const [pdfRes, emailResult] = await Promise.all([
        fetch('/products/pdf_vista'),
        sendQuotePDF(userData.name, userData.email, userData.lastname)
          .then((r) => ({ ok: true, msg: r.msg }))
          .catch((e) => ({ ok: false, msg: e.message })),
      ])
      if (emailResult.ok) {
        alert('Cotización enviada a tu correo exitosamente')
      } else {
        console.warn('Error enviando por correo:', emailResult.msg)
      }
      if (!pdfRes.ok) {
        const text = await pdfRes.text()
        alert(text || 'Error al generar el PDF')
        return
      }
      const blob = await pdfRes.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cotizacion.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error descargando PDF:', err)
      alert('Error al descargar la cotización. Intenta de nuevo.')
    }
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchCat = activeCategory === null || Number(p.category) === activeCategory
    if (!searchQuery) return matchCat
    const q = searchQuery.toLowerCase()
    const matchName = p.name?.toLowerCase().includes(q)
    const matchCatName = p.category_name?.toLowerCase().includes(q)
    return matchCat && (matchName || matchCatName)
  })

  const needsScrollbar = quoteItems.length > 0 || calculation !== null

  return (
    <div>
      <Navbar onLogout={handleLogout} onSearch={setSearchQuery} />
      {carouselSlides.length > 0 && <HeroCarousel slides={carouselSlides} />}

      <div className="grid grid-cols-2 md:flex bg-surface border-b-[1.5px] border-border">
        {[
          { icon: '🏗️', value: '+2.400', label: 'Instalaciones' },
          { icon: '☀️', value: '6.5h', label: 'HSP promedio Colombia' },
          { icon: '🛡️', value: '25 años', label: 'Garantía paneles' },
          { icon: '🌿', value: '0%', label: 'Emisiones CO₂' },
        ].map((stat, i) => (
          <div
            key={i}
            className={`md:flex-1 py-2 md:py-4 px-2 md:px-6 flex items-center gap-1.5 md:gap-3 border-b border-border-2 md:border-b-0 ${i % 2 === 0 ? 'border-r' : ''} hover:bg-surface-2 transition-colors duration-[0.22s] cursor-default`}
          >
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-green-light border-[1.5px] border-green-mid flex items-center justify-center text-xs md:text-lg flex-shrink-0">
              {stat.icon}
            </div>
            <div className="min-w-0">
              <div className="font-num text-xs md:text-xl lg:text-2xl font-extrabold text-ink leading-none tracking-tight">{stat.value}</div>
              <div className="text-[0.55rem] md:text-[0.72rem] font-medium text-text-3 mt-0.5 truncate">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 px-4 lg:px-8 pt-7 pb-2">
        <h3 className="font-num text-xl lg:text-2xl font-extrabold text-ink tracking-tight">
          Productos disponibles
        </h3>
        <span className="text-[0.72rem] font-semibold text-green-dark bg-green-light border-[1.5px] border-green-mid px-2.5 py-0.5 rounded-full">
          {filteredProducts.length} artículos
        </span>
      </div>

      <CategoryFilter
        products={products}
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
      />

      <div className="flex flex-col lg:flex-row gap-6 px-4 lg:px-8 pb-12 items-start">
        <ProductGallery
          products={filteredProducts}
          onAddToQuote={handleAddProduct}
          onRemoveFromQuote={handleRemoveProduct}
          quoteItems={quoteItems}
        />

        <div ref={cotizadorRef} className="flex-shrink-0">
          <CotizadorPanel
            calculation={calculation}
            quoteItems={quoteItems}
            onRemoveRequirement={handleRemoveRequirement}
            onAddRequirement={handleAddRequirement}
            onRemoveItem={handleRemoveItem}
            onReset={handleReset}
            user={user}
            onSendPDF={handleSendPDF}
            removedRequirements={removedRequirements}
            expanded={cotizadorExpanded}
            onExpand={setCotizadorExpanded}
          />
        </div>
      </div>

      {cotizadorExpanded && (
        <CotizadorFullscreen
          calculation={calculation}
          quoteItems={quoteItems}
          onRemoveRequirement={handleRemoveRequirement}
          onAddRequirement={handleAddRequirement}
          onRemoveItem={handleRemoveItem}
          onReset={handleReset}
          user={user}
          onSendPDF={handleSendPDF}
          removedRequirements={removedRequirements}
          onClose={() => setCotizadorExpanded(false)}
        />
      )}
      {flyingSrc && (
        <FlyingElement
          startX={flyingSrc.x}
          startY={flyingSrc.y}
          targetRef={cotizadorRef}
          label={flyingSrc.product.name}
          onComplete={() => {
            doAddProduct(flyingSrc.product, flyingSrc.hours)
            setFlyingSrc(null)
          }}
        />
      )}
      <Footer />

      {quoteItems.length > 0 && (
        <>
          <button
            onClick={() => setCotizadorExpanded(true)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden bg-surface border-[1.5px] border-border rounded-full shadow-[0_4px_24px_rgba(13,27,9,0.18)] flex items-center gap-3 px-5 py-3 cursor-pointer transition-all duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 active:translate-y-0 animate-slideUp"
            title="Ver cotizador"
          >
            <div className="w-7 h-7 rounded-full bg-green flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-display font-bold text-xs text-ink whitespace-nowrap">
              {quoteItems.length} {quoteItems.length === 1 ? 'producto' : 'productos'}
            </span>
            {calculation && (
              <span className="font-num font-extrabold text-sm text-green-dark">
                ${(
                  (calculation.total_final_basic || 0) + (calculation.total_precios || 0)
                ).toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </span>
            )}
          </button>

          <PdfDownloadButton
            onClick={() => handleSendPDF(user)}
            compact
            className="fixed bottom-6 right-6 z-40 shadow-[0_4px_20px_rgba(64,201,42,0.35)] hover:-translate-y-1 hover:shadow-[0_6px_28px_rgba(64,201,42,0.5)]"
          />
        </>
      )}
    </div>
  )
}

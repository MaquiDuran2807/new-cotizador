import PropTypes from 'prop-types'
import ProductCard from './ProductCard.jsx'

export default function ProductGallery({ products, onAddToQuote, onRemoveFromQuote, quoteItems }) {
  return (
    <div className="flex-1 min-w-0 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAddToQuote}
          onRemove={onRemoveFromQuote}
          quoteItem={quoteItems.find((qi) => qi.product_id == product.id)}
        />
      ))}
    </div>
  )
}

ProductGallery.propTypes = {
  products: PropTypes.array.isRequired,
  onAddToQuote: PropTypes.func.isRequired,
  onRemoveFromQuote: PropTypes.func.isRequired,
  quoteItems: PropTypes.array.isRequired,
}

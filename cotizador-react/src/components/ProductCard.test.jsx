import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProductCard from './ProductCard.jsx'

const mockProduct = {
  id: 1,
  name: 'Panel Solar 300W',
  price: 850000,
  description: 'Panel solar monocristalino de 300W de alta eficiencia.',
  image: 'https://via.placeholder.com/400',
}

describe('ProductCard', () => {
  it('renderiza el nombre y precio del producto', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        quoteItems={[]}
        quoteItem={null}
      />,
    )
    expect(screen.getByText('Panel Solar 300W')).toBeInTheDocument()
    expect(screen.getByText(/850\.000/)).toBeInTheDocument()
  })

  it('llama a onAdd con el producto y horas al hacer clic en Agregar', () => {
    const onAdd = vi.fn()
    render(
      <ProductCard
        product={mockProduct}
        onAdd={onAdd}
        onRemove={vi.fn()}
        quoteItems={[]}
        quoteItem={null}
      />,
    )
    const addBtn = screen.getByText('Agregar')
    fireEvent.click(addBtn)
    expect(onAdd).toHaveBeenCalledWith(mockProduct, 24, expect.any(Object))
  })

  it('llama a onRemove con el id del producto al hacer clic en Eliminar', () => {
    const onRemove = vi.fn()
    render(
      <ProductCard
        product={mockProduct}
        onAdd={vi.fn()}
        onRemove={onRemove}
        quoteItems={[]}
        quoteItem={null}
      />,
    )
    const delBtn = screen.getByText('Eliminar')
    fireEvent.click(delBtn)
    expect(onRemove).toHaveBeenCalledWith(1)
  })

  it('cambia el texto del botón a Actualizar cuando el producto está en el cotizador', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
        quoteItems={[{ product_id: 1, amount: 2, hours: 12 }]}
        quoteItem={{ product_id: 1, amount: 2, hours: 12 }}
      />,
    )
    expect(screen.getByText('Actualizar')).toBeInTheDocument()
  })
})

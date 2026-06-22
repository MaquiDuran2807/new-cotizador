const API_URL = '/products/'

export async function fetchProducts() {
  const response = await fetch(`${API_URL}api/products`)
  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`)
  }
  return response.json()
}

export async function calculateQuote(items) {
  const response = await fetch(`${API_URL}vista_prueba`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  })
  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.statusText}`)
  }
  return response.json()
}

export function getCSRFToken() {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.startsWith('csrftoken=')) {
        cookieValue = decodeURIComponent(cookie.substring('csrftoken='.length))
        break
      }
    }
  }
  return cookieValue
}

export async function fetchCurrentUser() {
  const response = await fetch(`${API_URL}api/me`)
  if (!response.ok) throw new Error('No autenticado')
  return response.json()
}

export async function fetchCarouselSlides() {
  const response = await fetch(`${API_URL}api/carousel-slides`)
  if (!response.ok) throw new Error('Error fetching carousel slides')
  return response.json()
}

export async function updateCurrentUser(data) {
    const response = await fetch(`${API_URL}api/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Error actualizando perfil')
    return response.json()
}

export async function fetchDepartments() {
    const response = await fetch(`${API_URL}api/departments`)
    if (!response.ok) throw new Error('Error fetching departments')
    return response.json()
}

export async function fetchMunicipalities(departmentId) {
    const params = departmentId ? `?department_id=${departmentId}` : ''
    const response = await fetch(`${API_URL}api/municipalities${params}`)
    if (!response.ok) throw new Error('Error fetching municipalities')
    return response.json()
}

export async function sendQuotePDF(nombre, email, apellido) {
  const response = await fetch(`${API_URL}sendQuote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    body: JSON.stringify({ name: nombre, lastname: apellido, email }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || response.statusText)
  }
  return data
}

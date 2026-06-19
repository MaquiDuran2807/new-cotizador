import '@testing-library/jest-dom'

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
}
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = MockIntersectionObserver
}

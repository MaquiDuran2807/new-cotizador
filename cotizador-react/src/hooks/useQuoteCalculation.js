import { useMemo } from 'react'

export function useQuoteCalculation(calculation) {
  return useMemo(() => {
    if (!calculation || calculation.error) {
      return { totalNormal: 0, totalPremium: 0 }
    }
    return {
      totalNormal: calculation.total_final_basic || 0,
      totalPremium: calculation.total_final_premiun || 0,
    }
  }, [calculation])
}

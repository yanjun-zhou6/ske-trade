import { createContext, useContext } from 'react'

const creactTradeContext = () => {
  const TradeContext = createContext<{
    setTradeStatus: (
      tradeId: string,
      properties: {
        updated?: boolean
        created?: boolean
        highlight?: boolean
      },
    ) => void
    removeTrade: (tradeId: string) => void
    setTotalAmount: React.Dispatch<React.SetStateAction<number>>
  }>({
    setTradeStatus: () => {},
    removeTrade: () => {},
    setTotalAmount: () => {},
  })

  const useTrade = () => {
    return useContext(TradeContext)
  }

  return {
    useTrade,
    TradeProvider: TradeContext.Provider,
  }
}

const { useTrade, TradeProvider } = creactTradeContext()

export { useTrade, TradeProvider }

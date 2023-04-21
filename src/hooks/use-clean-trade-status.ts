import { createContext, useContext } from 'react'

const creactCleanTradeStatus = () => {
  const CleanTradeStatusContext = createContext<
    (tradeId: string, properties: Record<'updated' | 'created', false>) => void
  >(() => {})

  const useCleanTradeStatus = () => {
    const cleanTradeStatus = useContext(CleanTradeStatusContext)

    return cleanTradeStatus
  }

  return {
    useCleanTradeStatus,
    CleanTradeStatusProvider: CleanTradeStatusContext.Provider,
  }
}

const { useCleanTradeStatus, CleanTradeStatusProvider } =
  creactCleanTradeStatus()

export { useCleanTradeStatus, CleanTradeStatusProvider }

import { createContext, useContext } from 'react'

const creactWebsocketClient = () => {
  const WebsocketClientContext = createContext(null)

  const useWebsocketClient = () => {
    const websocketClient = useContext(WebsocketClientContext)

    return websocketClient
  }

  const WebsocketClientProvider: React.FC = ({ children }) => {
    return (
      <WebsocketClientContext.Provider>
        {children}
      </WebsocketClientContext.Provider>
    )
  }

  return { useWebsocketClient }
}

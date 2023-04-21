import { createContext, useContext } from 'react'
import { WebSocketClient } from '../websocket-client'

const creactWebSocketClient = () => {
  const WebsocketClientContext = createContext<WebSocketClient | null>(null)

  const useWebSocketClient = () => {
    const websocketClient = useContext(WebsocketClientContext)

    return websocketClient
  }

  return {
    useWebSocketClient,
    WebsocketClientProvider: WebsocketClientContext.Provider,
  }
}

const { useWebSocketClient, WebsocketClientProvider } = creactWebSocketClient()

export { useWebSocketClient, WebsocketClientProvider }

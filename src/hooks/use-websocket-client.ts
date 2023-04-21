import { createContext, useContext } from 'react'
import createWebSocketClient, { WebSocketClient } from '../websocket-client'

const webSocketClient = createWebSocketClient(process.env.SOCKET_ADDRESS ?? '')

const creactWebSocketClient = () => {
  const WebsocketClientContext = createContext<WebSocketClient>(webSocketClient)

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

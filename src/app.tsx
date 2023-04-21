import TradeBoard from './components/TradeBoard'
import { WebsocketClientProvider } from './hooks/use-websocket-client'
import createWebSocketClient from './websocket-client'
import ErrorBoundary from './components/ErrorBoundary'

const webSocketClient = createWebSocketClient(process.env.SOCKET_ADDRESS ?? '')

const App = (): JSX.Element => {
  return (
    <ErrorBoundary>
      <WebsocketClientProvider value={webSocketClient}>
        <TradeBoard />
      </WebsocketClientProvider>
    </ErrorBoundary>
  )
}

export default App

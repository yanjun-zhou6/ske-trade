import renderer from 'react-test-renderer'
import { render, screen } from '@testing-library/react'
import { BehaviorSubject } from 'rxjs'
import TradeBoard from '@app/components/TradeBoard'
import { WebsocketClientProvider } from '@app/hooks/use-websocket-client'
import createWebSocketClient, { WebSocketClient } from '@app/websocket-client'
import { Response } from '@app/types'
import Table from '@app/components/Table'
import mockData from './data.json'

export interface MockWebSocketClient extends WebSocketClient {
  send: (data: Response) => void
}

const mockResponseSubject = new BehaviorSubject<Response>(mockData)
const mockResponseObservable = mockResponseSubject.asObservable()
jest.mock('@app/websocket-client', () => {
  return {
    __esModule: true,
    default: () => {
      return {
        send: (data: Response) => mockResponseSubject.next(data),
        request: jest.fn(() => {
          return mockResponseObservable
        }),
        responseObservable: mockResponseObservable,
      }
    },
  }
})

const webSocketClient = createWebSocketClient('') as MockWebSocketClient

it('render TradeBoard', async () => {
  render(
    <WebsocketClientProvider value={webSocketClient}>
      <TradeBoard />
    </WebsocketClientProvider>,
  )

  expect(await screen.findAllByText('BTC/USDT')).toHaveLength(4)
})

it.skip('render TradeBoard with trades returned', () => {
  const component = renderer.create(
    <WebsocketClientProvider value={webSocketClient}>
      <TradeBoard />
    </WebsocketClientProvider>,
  )

  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  renderer.act(() => {
    component.root.findAllByType(Table)[0].props.loadMore()
  })

  tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

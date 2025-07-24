import { Subject, Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { Response } from './types'

export interface Message {
  eventType: string
  [key: string]: unknown
}

export interface WebSocketClient {
  request: <T>(message: Message) => Observable<Response<T>>
  close: () => void
  responseObservable: Observable<Response>
}

const createWebSocketClient = (
  address: string,
  intercept: (
    responseObservable: Observable<Response>,
  ) => Observable<Response> = (responseObservable) => responseObservable,
): WebSocketClient => {
  let messagePool: Message[] = []
  let ws = new WebSocket(address)
  const responseSubject = new Subject<Response>()
  const responseObservable = intercept(responseSubject.asObservable())

  const reconnect = () => {
    ws = new WebSocket(address)
  }

  const request = <T>(message: Message) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(window.btoa(JSON.stringify(message)))
    } else if (ws.readyState === ws.CONNECTING) {
      messagePool.push(message)
    } else {
      // ws is in closed or closing status, then reconnect
      messagePool.push(message)
      reconnect()
    }

    return responseObservable.pipe(
      filter(({ eventType }) => eventType === message.eventType),
    ) as Observable<Response<T>>
  }

  const close = () => ws.close()

  ws.addEventListener('open', () => {
    if (messagePool.length) {
      messagePool.forEach((message) => {
        ws.send(window.btoa(JSON.stringify(message)))
      })
      messagePool = []
    }
  })

  ws.addEventListener('message', (event) => {
    responseSubject.next(JSON.parse(window.atob(event.data)))
  })

  ws.addEventListener('error', responseSubject.error)

  return {
    request,
    close,
    responseObservable,
  }
}

export default createWebSocketClient

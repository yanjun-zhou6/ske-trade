import { Subject, Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { Response } from './model'

export interface Message {
  eventType: string
  [key: string]: unknown
}

export interface WebSocketClient {
  request: <T>(message: Message) => Observable<Response<T>>
  responseObservable: Observable<Response>
}

const createWebSocketClient = (
  address: string,
  intercept: (
    responseObservable: Observable<Response>,
  ) => Observable<Response> = (responseObservable) => responseObservable,
): WebSocketClient => {
  let messagePool: Message[] = []
  const ws = new WebSocket(address)
  const responseSubject = new Subject<Response>()
  const responseObservable = intercept(responseSubject.asObservable())

  const request = <T>(message: Message) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(window.btoa(JSON.stringify(message)))
    } else if (ws.readyState === ws.CONNECTING) {
      messagePool.push(message)
    } else throw Error('websocket is closing or closed')

    return responseObservable.pipe(
      filter(({ eventType }) => eventType === message.eventType),
    ) as Observable<Response<T>>
  }

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

  ws.addEventListener('error', console.error)

  return {
    request,
    responseObservable,
  }
}

export default createWebSocketClient

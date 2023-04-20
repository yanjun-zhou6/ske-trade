import WebSocket from 'ws'
import { Subject, Observable } from 'rxjs'

export interface Message {
  eventType: string
  [key: string]: unknown
}

const WebSocketClient = (
  address: string,
  intercept: (
    responseObservable: Observable<unknown>,
  ) => Observable<unknown> = (responseObservable) => responseObservable,
) => {
  let messagePool: Message[] = []
  const ws = new WebSocket(address)
  const responseSubject = new Subject()
  const responseObservable = intercept(responseSubject.asObservable())

  const request = (message: Message) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(window.btoa(JSON.stringify(message)))
    } else if (ws.readyState === ws.CONNECTING) {
      messagePool.push(message)
    } else throw Error('websocket is closing or closed')
  }

  ws.on('open', () => {
    if (messagePool.length) {
      messagePool.forEach((message) => {
        ws.send(window.btoa(JSON.stringify(message)))
      })
      messagePool = []
    }
  })

  ws.on('message', (data: string) => {
    responseSubject.next(JSON.parse(window.atob(data)))
  })

  ws.on('error', console.error)

  return {
    request,
    responseObservable,
  }
}

export default WebSocketClient

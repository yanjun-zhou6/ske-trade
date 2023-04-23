export enum Trend {
  Up = 'Up',
  Down = 'Down',
  Origin = 'Origin',
}

export enum TradeStatus {
  New = 'New',
  Updated = 'Updated',
  Closed = 'Closed',
}

export interface TradeEntity {
  tradeId: string
  tradeName: string
  tradeSymbol: string
  currentPrice: number
  lastPrice: number
  traderName: string
  trend: Trend
  updateTime: string
  createTime: string
  tradeStatus: TradeStatus
  updated?: boolean
  created?: boolean
  highlight?: boolean
}

export enum ResponseCode {
  Success = 1,
  Failure = 0,
}

export interface Response<T = unknown> {
  eventType: string
  code: number
  data: T
}

export interface GetTradesAPIReturn {
  totalAmount: number
  trades: TradeEntity[]
  hasMore: boolean
}

export interface UpdateTradesAPIReturn {
  addTrades: TradeEntity[]
  updateTrades: TradeEntity[]
  totalAmount: number
}

export interface DeleteTradeAPIReturn {
  totalAmount: number
}

type RGB = `rgb(${number}, ${number}, ${number})`
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`
type HEX = `#${string}`

export type Color = RGB | RGBA | HEX

import { faker } from '@faker-js/faker'

enum Direction {
  Up = 'Up',
  Down = 'Down',
  Origin = 'Origin',
}

enum TradeStatus {
  New = 'New',
  Updated = 'Updated',
  Closed = 'Closed',
}

interface TradeEntity {
  tradeId: string
  tradeName: string
  tradeSymbol: string
  currentPrice: string
  lastPrice: string
  traderName: string
  trend: Direction
  updateTime: string
  createTime: string
  tradeStatus: TradeStatus
}

const formatDate = (d: Date): string => {
  const dformat =
    [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') +
    ' ' +
    [d.getHours(), d.getMinutes(), d.getSeconds()].join(':')

  return dformat
}

const generateTradeEntity = (): TradeEntity => {
  return {
    tradeId: faker.datatype.uuid(),
    tradeName: faker.name.lastName(),
    tradeSymbol: faker.datatype.uuid(),
    currentPrice: faker.finance.amount(),
    lastPrice: faker.finance.amount(),
    traderName: faker.name.fullName(),
    trend: Direction.Origin,
    updateTime: formatDate(new Date()),
    createTime: formatDate(faker.date.past()),
    tradeStatus: TradeStatus.New,
  }
}

export const makeData = (number: number): TradeEntity[] => {
  return Array.from({ length: number }).map(() => generateTradeEntity())
}

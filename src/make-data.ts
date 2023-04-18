import { faker } from '@faker-js/faker'

enum Direction {
  Up,
  Down,
  Origin,
}

enum TradeStatus {
  New,
  Updated,
  Closed,
}

interface TradeEntity {
  TradeId: string
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

export function generateTradeEntity(): TradeEntity {
  return {
    TradeId: faker.datatype.uuid(),
    tradeName: faker.word.adjective(),
    tradeSymbol: faker.datatype.uuid(),
    currentPrice: faker.finance.amount(),
    lastPrice: faker.finance.amount(),
    traderName: faker.name.fullName(),
    trend: Direction.Origin,
    updateTime: Date().toString(),
    createTime: faker.date.past().toTimeString(),
    tradeStatus: TradeStatus.New,
  }
}

Array.from({ length: 10 }).forEach(() => {
  USERS.push(createRandomUser())
})

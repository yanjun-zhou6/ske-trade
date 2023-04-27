import { useCallback, useEffect, useMemo, useState } from 'react'
import { firstValueFrom } from 'rxjs'
import { filter } from 'rxjs/operators'
import styled from 'styled-components'
import { produce } from 'immer'
import moment from 'moment'
import { useWebSocketClient } from '../../hooks/use-websocket-client'
import Table from '../Table'
import { columns } from './config'
import {
  TradeEntity,
  GetTradesAPIReturn,
  UpdateTradesAPIReturn,
} from '../../types'
import { TradeProvider } from '../../hooks/use-trade'

const Title = styled.h2`
  padding-left: 1rem;
`
const TotalAmount = styled.div`
  text-align: end;
  width: 1370px;
`

const TradeBoard = (): JSX.Element => {
  const [tradeMap, setTradeMap] = useState<Record<string, TradeEntity>>({})
  const [hasNextPage, setHasNextPage] = useState(true)
  const [page, setPage] = useState(1)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const webSocketClient = useWebSocketClient()

  const loadTrades = useCallback(async () => {
    try {
      setIsNextPageLoading(true)
      const response = await firstValueFrom(
        webSocketClient.request<GetTradesAPIReturn>({
          eventType: 'getTrades',
          page,
          amount: 10,
        }),
      )
      const { trades, hasMore, totalAmount } = response.data
      const trade = trades.reduce<Record<string, TradeEntity>>((acc, trade) => {
        acc[trade.tradeId] = convertTradeFormat(trade)
        return acc
      }, {})
      setTradeMap({ ...tradeMap, ...trade })
      setIsNextPageLoading(false)
      setHasNextPage(hasMore)
      setTotalAmount(totalAmount)
      setPage(page + 1)
    } catch (e) {
      console.error(e)
    }
  }, [tradeMap, page])

  useEffect(function observeTradesChange() {
    const subscription = webSocketClient.responseObservable
      .pipe(filter(({ eventType }) => eventType === 'updateTrades'))
      .subscribe({
        next: (response) => {
          const data = response.data as UpdateTradesAPIReturn
          const { updateTrades, addTrades, totalAmount } = data
          setTotalAmount(totalAmount)
          setTradeMap(
            produce((draftState) => {
              updateTrades.forEach((updateTrade) => {
                draftState[updateTrade.tradeId] = markUpdated(
                  convertTradeFormat(updateTrade),
                )
              })
              addTrades.forEach((addTrade) => {
                draftState[addTrade.tradeId] = markCreated(
                  convertTradeFormat(addTrade),
                )
              })
            }),
          )
        },
        error: console.error,
      })

    return () => subscription.unsubscribe()
  }, [])

  const setTradeStatus = useCallback(
    (
      tradeId: string,
      properties: {
        updated?: boolean
        created?: boolean
        highlight?: boolean
      },
    ) => {
      setTradeMap(
        produce((draftState) => {
          const { updated, created, highlight } = properties
          if (!draftState[tradeId]) return draftState

          if (updated !== undefined) {
            draftState[tradeId].updated = updated
          }
          if (created !== undefined) {
            draftState[tradeId].created = created
          }
          if (highlight !== undefined) {
            draftState[tradeId].highlight = highlight
          }

          return draftState
        }),
      )
    },
    [],
  )

  const removeTrade = useCallback((tradeId: string) => {
    setTradeMap(
      produce((draftState) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete draftState[tradeId]
        return draftState
      }),
    )
  }, [])

  const trades = useMemo(() => Object.values(tradeMap), [tradeMap])

  return (
    <TradeProvider value={{ setTradeStatus, removeTrade, setTotalAmount }}>
      <Title>Trade Board Table</Title>
      <Table
        columns={columns}
        data={trades}
        isNextPageLoading={isNextPageLoading}
        loadMore={loadTrades}
        hasNextPage={hasNextPage}
      />
      <TotalAmount>Total amount of trades: {totalAmount}</TotalAmount>
    </TradeProvider>
  )
}

const convertTradeFormat = (trade: TradeEntity) => {
  return {
    ...trade,
    updateTime: moment(trade.updateTime).format('hh:mm:ss MM/DD/YYYY'),
    createTime: moment(trade.createTime).format('hh:mm:ss MM/DD/YYYY'),
  }
}

const markUpdated = (trade: TradeEntity) => {
  return {
    ...trade,
    updated: true,
  }
}

const markCreated = (trade: TradeEntity) => {
  return {
    ...trade,
    created: true,
  }
}

export default TradeBoard

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
import { CleanTradeStatusProvider } from '../../hooks/use-clean-trade-status'

const Title = styled.h2`
  padding-left: 1rem;
`

const TradeBoard = (): JSX.Element => {
  const [tradeMap, setTradeMap] = useState<Record<string, TradeEntity>>({})
  const [hasNextPage, setHasNextPage] = useState(true)
  const [page, setPage] = useState(1)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)
  const webSocketClient = useWebSocketClient()

  const loadTrades = useCallback(
    async (...args: any) => {
      setIsNextPageLoading(true)
      const response = await firstValueFrom(
        webSocketClient?.request<GetTradesAPIReturn>({
          eventType: 'getTrades',
          page,
          amount: 10,
        }),
      )
      const { trades, hasMore } = response.data
      const trade = trades.reduce<Record<string, TradeEntity>>((acc, trade) => {
        acc[trade.tradeId] = convertTradeFormat(trade)
        return acc
      }, {})
      setTradeMap({ ...tradeMap, ...trade })
      setIsNextPageLoading(false)
      setHasNextPage(hasMore)
      setPage(page + 1)
    },
    [tradeMap, page],
  )

  /** */
  useEffect(function observeTradesChange() {
    const subscription = webSocketClient?.responseObservable
      .pipe(filter(({ eventType }) => eventType === 'updateTrades'))
      .subscribe((response) => {
        const data = response.data as UpdateTradesAPIReturn
        const { updateTrades, addTrades } = data
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
      })

    return () => subscription.unsubscribe()
  }, [])

  const cleanTradeStatus = useCallback(
    (tradeId: string, properties: Record<'updated' | 'created', false>) => {
      setTradeMap(
        produce((draftState) => {
          draftState[tradeId].updated = properties.updated
          draftState[tradeId].created = properties.created

          return draftState
        }),
      )
    },
    [],
  )

  const trades = useMemo(() => Object.values(tradeMap), [tradeMap])

  console.log('trades', trades.length)

  return (
    <CleanTradeStatusProvider value={cleanTradeStatus}>
      <Title>Trade Board Table</Title>
      <Table
        columns={columns}
        data={trades}
        isNextPageLoading={isNextPageLoading}
        loadMore={loadTrades}
        hasNextPage={hasNextPage}
      />
    </CleanTradeStatusProvider>
  )
}

const convertTradeFormat = (trade: TradeEntity) => {
  return {
    ...trade,
    updateTime: moment(trade.updateTime).format('hh:mm:ss MM/DD/YYYY'),
    createTime: moment(trade.createTime).format('hh:mm:ss MM/DD/YYYY'),
    updated: false,
    created: false,
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

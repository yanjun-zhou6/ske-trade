import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
} from '../../model'

const Title = styled.h2`
  padding-left: 1rem;
`

const TradeBoard = (): JSX.Element => {
  const loadRange = useRef({ startIndex: -1, stopIndex: 0 })
  const [tradeMap, setTradeMap] = useState<Record<string, TradeEntity>>({})
  const [hasNextPage, setHasNextPage] = useState(true)
  const [page, setPage] = useState(1)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)
  const webSocketClient = useWebSocketClient()

  const loadTrades = useCallback(
    async (...args: any) => {
      const [startIndex, stopIndex] = args
      if (startIndex === loadRange.current.startIndex) return
      setIsNextPageLoading(true)
      const response = await firstValueFrom(
        webSocketClient?.request<GetTradesAPIReturn>({
          eventType: 'getTrades',
          page,
          amount: 20,
        }),
      )
      const { trades, hasMore } = response.data
      // console.log('hasMore', hasMore, page)
      const trade = trades.reduce<Record<string, TradeEntity>>((acc, trade) => {
        acc[trade.tradeId] = {
          ...trade,
          updateTime: moment(trade.updateTime).format('hh:mm:ss MM/DD/YYYY'),
          createTime: moment(trade.createTime).format('hh:mm:ss MM/DD/YYYY'),
        }
        return acc
      }, {})
      // console.log(trades)
      setTradeMap({ ...tradeMap, ...trade })
      setIsNextPageLoading(false)
      setHasNextPage(hasMore)
      setPage(page + 1)
      loadRange.current = { startIndex, stopIndex }
    },
    [tradeMap, page],
  )

  // useEffect(() => {
  //   ;(async () => {
  //     await loadTrades()
  //   })()
  // }, [])

  /**
  useEffect(() => {
    const subscription = webSocketClient?.responseObservable
      .pipe(filter(({ eventType }) => eventType === 'updateTrades'))
      .subscribe((response) => {
        const data = response.data as UpdateTradesAPIReturn
        const { updateTrades } = data
        console.log('s', updateTrades)
        const newTradeMap = produce(tradeMap, (draftState) => {
          updateTrades.forEach(
            (updateTrade) =>
              (draftState[updateTrade.tradeId] = {
                ...updateTrade,
                updateTime: moment(updateTrade.updateTime).format(
                  'hh:mm:ss MM/DD/YYYY',
                ),
                createTime: moment(updateTrade.createTime).format(
                  'hh:mm:ss MM/DD/YYYY',
                ),
              }),
          )
        })

        setTradeMap(newTradeMap)

        return () => subscription?.unsubscribe()
      })
  }, [tradeMap, webSocketClient?.responseObservable])
  */
  const trades = useMemo(() => Object.values(tradeMap), [tradeMap])

  console.log('number', trades.length, Object.keys(tradeMap).length)
  return (
    <>
      <Title>Trade Board Table</Title>
      <Table
        columns={columns}
        data={trades}
        isNextPageLoading={isNextPageLoading}
        loadMore={loadTrades}
        hasNextPage={hasNextPage}
      />
    </>
  )
}

export default TradeBoard

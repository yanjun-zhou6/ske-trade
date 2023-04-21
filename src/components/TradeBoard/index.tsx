import { useEffect, useMemo, useState } from 'react'
import { filter } from 'rxjs/operators'
import styled from 'styled-components'
import { produce } from 'immer'
import moment from 'moment'
import { useWebSocketClient } from '../../hooks/use-websocket-client'
import Table from '../Table'
import {
  TradeEntity,
  GetTradesAPIReturn,
  UpdateTradesAPIReturn,
} from '../../model'

const Title = styled.h2`
  padding-left: 1rem;
`

const TradeBoard = (): JSX.Element => {
  const [tradeMap, setTradeMap] = useState<Record<string, TradeEntity>>({})
  const webSocketClient = useWebSocketClient()

  useEffect(() => {
    webSocketClient
      ?.request<GetTradesAPIReturn>({
        eventType: 'getTrades',
        page: 0,
        amount: 10000,
      })
      .subscribe((response) => {
        console.log(response.data.totalAmount)
        const trade = response.data.trades.reduce<Record<string, TradeEntity>>(
          (acc, trade) => {
            acc[trade.tradeId] = {
              ...trade,
              updateTime: moment(trade.updateTime).format(
                'hh:mm:ss MM/DD/YYYY',
              ),
              createTime: moment(trade.createTime).format(
                'hh:mm:ss MM/DD/YYYY',
              ),
            }
            return acc
          },
          {},
        )
        setTradeMap(trade)
      })
  }, [webSocketClient])

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

  const columns = useMemo(
    () => [
      {
        Header: 'Trade Name',
        accessor: 'tradeName',
      },
      {
        Header: 'Trade Symbol',
        accessor: 'tradeSymbol',
      },
      {
        Header: 'Current Price',
        accessor: 'currentPrice',
      },
      {
        Header: 'Last Price',
        accessor: 'lastPrice',
      },
      {
        Header: 'Trader Name',
        accessor: 'traderName',
      },
      {
        Header: 'Trend',
        accessor: 'trend',
      },
      {
        Header: 'Update Time',
        accessor: 'updateTime',
      },
      {
        Header: 'Create Time',
        accessor: 'createTime',
      },
      {
        Header: 'Trade Status',
        accessor: 'tradeStatus',
      },
    ],
    [],
  )

  return (
    <>
      <Title>Trade Board Table</Title>
      <Table columns={columns} data={trades} />
    </>
  )
}

export default TradeBoard

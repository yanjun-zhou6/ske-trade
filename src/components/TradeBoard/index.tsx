import { useMemo } from 'react'
import styled from 'styled-components'
import { makeData } from '../../make-data'
import Table from '../Table'

const Title = styled.h2`
  padding-left: 1rem;
`

const TradeBoard = (): JSX.Element => {
  const columns = useMemo(
    () => [
      {
        Header: 'Trade Id',
        accessor: 'tradeId',
      },
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

  const data = useMemo(() => makeData(100), [])

  return (
    <>
      <Title>Trade Board Table</Title>
      <Table columns={columns} data={data} />
    </>
  )
}

export default TradeBoard

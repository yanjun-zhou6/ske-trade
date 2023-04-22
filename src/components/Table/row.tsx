import { useEffect, useState } from 'react'
import { timer } from 'rxjs'
import { Row as ReactTableRow, TableRowProps } from 'react-table'
import styled from 'styled-components'
import { useCleanTradeStatus } from '../../hooks/use-clean-trade-status'
import { Color, TradeEntity, Trend } from '../../types'
import Cell from './Cell'

export interface RowColors {
  up: Color
  down: Color
  same: Color
  highlight: Color
  new: Color
}

export interface RowProps {
  row: ReactTableRow<object>
  tableRowProps: TableRowProps
  rowColors?: RowColors
}

const REGULAR_COLOR = '#fff' as Color

interface RowWrapperProps {
  readonly backgroundColor: Color
}
const RowWrapper = styled.div<RowWrapperProps>`
  background: ${(props) => props.backgroundColor};
`

const Row = ({
  row,
  tableRowProps,
  rowColors = {
    up: '#FF0000',
    down: '#008000',
    same: '#808080',
    highlight: '#0000FF',
    new: '#FFFF00',
  },
}: RowProps) => {
  const [backgroundColor, setBackgroundColor] = useState(REGULAR_COLOR)
  const cleanTradeStatus = useCleanTradeStatus()

  useEffect(function () {
    const { updated, created, tradeId } = row.original as TradeEntity
    const { trend } = row.values
    let backgroundColor = REGULAR_COLOR

    if (updated) {
      backgroundColor =
        trend === Trend.Up
          ? rowColors.up
          : trend === Trend.Down
          ? rowColors.down
          : rowColors.same
    }

    if (created) {
      backgroundColor = rowColors.new
    }

    setBackgroundColor(backgroundColor)
    timer(500).subscribe(() => {
      setBackgroundColor(REGULAR_COLOR)
      cleanTradeStatus(tradeId, {
        updated: false,
        created: false,
      })
    })
  }, [])

  return (
    <RowWrapper
      {...tableRowProps}
      className='tr'
      backgroundColor={backgroundColor}
    >
      {row.cells.map((cell) => (
        <Cell cellDescription={cell} key={cell.column.id}></Cell>
      ))}
    </RowWrapper>
  )
}

export default Row

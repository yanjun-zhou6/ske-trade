import { useEffect, useState } from 'react'
import { timer } from 'rxjs'
import { Row as ReactTableRow, TableRowProps } from 'react-table'
import styled from 'styled-components'
import { useTrade } from '../../hooks/use-trade'
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
  setRightClickedRow: React.Dispatch<
    React.SetStateAction<ReactTableRow<object>>
  >
}

const DEFAULT_REGULAR_COLOR = '#fff' as Color

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
  setRightClickedRow,
}: RowProps) => {
  const [regularColor, setRegularColor] = useState(DEFAULT_REGULAR_COLOR)
  const [backgroundColor, setBackgroundColor] = useState(regularColor)
  const { setTradeStatus } = useTrade()

  useEffect(
    function changeBgColorOnTradeUpdate() {
      const { updated, created, tradeId } = row.original as TradeEntity
      if (updated === undefined && created === undefined) return

      const { trend } = row.values
      let backgroundColor = regularColor

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
        setBackgroundColor(regularColor)
        setTradeStatus(tradeId, {
          updated: false,
          created: false,
        })
      })
    },
    [regularColor],
  )

  useEffect(function changeRegularBgColorOnSet() {
    const { highlight } = row.original as TradeEntity

    if (highlight === undefined) return
    setRegularColor(highlight ? rowColors.highlight : DEFAULT_REGULAR_COLOR)
    setBackgroundColor(highlight ? rowColors.highlight : DEFAULT_REGULAR_COLOR)
  })

  return (
    <RowWrapper
      {...tableRowProps}
      className='tr'
      backgroundColor={backgroundColor}
      onContextMenu={(e) => {
        e.preventDefault()
        setRightClickedRow(row)
      }}
    >
      {row.cells.map((cell) => (
        <Cell cellDescription={cell} key={cell.column.id}></Cell>
      ))}
    </RowWrapper>
  )
}

export default Row

import { Cell as ReactTableCell } from 'react-table'
import styled from 'styled-components'
import { Trend } from '../../types'
import ArrowUp from './up.svg'
import ArrowDown from './down.svg'
import Horizontal from './horizontal.svg'

interface CellProps {
  cellDescription: ReactTableCell<object, any>
}

console.log('ArrowUp', ArrowUp)

const StyledArrowUp = styled(ArrowUp)`
  width: 8em;
  height: 2em;
`
const StyledArrowDown = styled(ArrowDown)`
  width: 8em;
  height: 2em;
`
const StyledHorizontal = styled(Horizontal)`
  width: 8em;
  height: 2em;
`

const Cell = ({ cellDescription }: CellProps) => {
  const {
    column: { id },
    value,
  } = cellDescription

  let CellNode = null

  // As trend field, disply arrow icon for different value
  if (id === 'trend') {
    CellNode =
      value === Trend.Up ? (
        <StyledArrowUp />
      ) : value === Trend.Down ? (
        <StyledArrowDown />
      ) : (
        <StyledHorizontal />
      )
  } else {
    CellNode = cellDescription.render('Cell')
  }

  return (
    <div {...cellDescription.getCellProps()} className='td'>
      {CellNode}
    </div>
  )
}

export default Cell

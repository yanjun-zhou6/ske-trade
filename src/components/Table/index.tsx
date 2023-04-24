import {
  Column,
  useBlockLayout,
  useTable,
  Row as ReactTableRow,
} from 'react-table'
import {
  useMemo,
  useCallback,
  CSSProperties,
  PureComponent,
  useState,
} from 'react'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import styled from 'styled-components'
import Row, { RowColors } from './Row'
import { scrollbarWidth } from '../../helper'
import useContextMenu from '../../hooks/use-context-menu'
import ContextMenu from '../ContextMenu'

interface TableProp {
  columns: Array<Column<object>>
  data: object[]
  isNextPageLoading: boolean
  loadMore: (startIndex: number, stopIndex: number) => Promise<void>
  hasNextPage: boolean
  rowColors?: RowColors
}

const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 1px solid black;
      }
    }
  }
`

const Table = ({
  columns,
  data,
  isNextPageLoading,
  loadMore,
  hasNextPage,
  rowColors,
}: TableProp): JSX.Element => {
  const [rightClickedRow, setRightClickedRow] = useState(
    null as unknown as ReactTableRow<object>,
  )
  const scrollBarSize = useMemo(() => scrollbarWidth(), [])
  const { clicked, setClicked, points, setPoints } = useContextMenu()
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useBlockLayout,
  )

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? data.length + 1 : data.length

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadMore

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = useCallback(
    (index: number) => {
      return !hasNextPage || index < data.length
    },
    [data.length, hasNextPage],
  )

  return (
    <Styles>
      <div {...getTableProps()} className='table'>
        <div>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <div {...headerGroup.getHeaderGroupProps()} className='tr'>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <div {...column.getHeaderProps()} className='th'>
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          {...getTableBodyProps()}
          onContextMenu={(e) => {
            e.preventDefault()
            setClicked(true)
            setPoints({
              x: e.pageX,
              y: e.pageY,
            })
          }}
        >
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                height={500}
                itemCount={itemCount}
                itemSize={40}
                width={totalColumnsWidth + scrollBarSize}
                onItemsRendered={onItemsRendered}
                ref={ref}
              >
                {/* {RenderRow as ComponentType<ListChildComponentProps<any>>} */}
                {({ index, style }) => (
                  <RenderRow
                    index={index}
                    style={style}
                    isItemLoaded={isItemLoaded}
                    prepareRow={prepareRow}
                    rows={rows}
                    rowColors={rowColors}
                    setRightClickedRow={setRightClickedRow}
                  ></RenderRow>
                )}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        </div>
      </div>
      <ContextMenu
        top={points.y}
        left={points.x}
        open={clicked}
        rightClickedRow={rightClickedRow}
      ></ContextMenu>
    </Styles>
  )
}

// const ContextMenuRow = applyContextMenu(Row)
class RenderRow extends PureComponent<{
  index: number
  style: CSSProperties
  isItemLoaded: (index: number) => boolean
  prepareRow: (row: ReactTableRow<object>) => void
  rows: Array<ReactTableRow<object>>
  setRightClickedRow: React.Dispatch<
    React.SetStateAction<ReactTableRow<object>>
  >
  rowColors?: RowColors
}> {
  render() {
    const {
      index,
      style,
      isItemLoaded,
      prepareRow,
      rows,
      rowColors,
      setRightClickedRow,
    } = this.props
    if (!isItemLoaded(index)) {
      return <div style={style}>Loading</div>
    }
    const row = rows[index]
    if (row) {
      prepareRow(row)
      return (
        <Row
          row={row}
          setRightClickedRow={setRightClickedRow}
          tableRowProps={row.getRowProps({
            style,
          })}
          rowColors={rowColors}
        />
      )
    } else return null
  }
}

export default Table

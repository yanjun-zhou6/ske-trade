import { Column, useBlockLayout, useTable } from 'react-table'
import { useMemo, useCallback } from 'react'
import { FixedSizeList } from 'react-window'

interface TableProp {
  columns: Array<Column<object>>
  data: object[]
}

const Table = ({ columns, data }: TableProp): JSX.Element => {
  const defaultColumn = useMemo(
    () => ({
      width: 150,
    }),
    [],
  )

  const scrollBarSize = useMemo(() => scrollbarWidth(), [])

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
      defaultColumn,
    },
    useBlockLayout,
  )

  const RenderRow = useCallback(
    ({ index, style }: { index: number; style: Record<string, unknown> }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className='tr'
        >
          {row.cells.map((cell) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <div {...cell.getCellProps()} className='td'>
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, rows],
  )

  // Render the UI for your table
  return (
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

      <div {...getTableBodyProps()}>
        <FixedSizeList
          height={400}
          itemCount={rows.length}
          itemSize={35}
          width={totalColumnsWidth + scrollBarSize}
        >
          {RenderRow}
        </FixedSizeList>
      </div>
    </div>
  )
}

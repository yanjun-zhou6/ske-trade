import styled, { css } from 'styled-components'
import { Row as ReactTableRow } from 'react-table'
import { useTrade } from '../../hooks/use-trade'
import { useCallback } from 'react'
import { useWebSocketClient } from '../../hooks/use-websocket-client'
import { TradeEntity, DeleteTradeAPIReturn, ResponseCode } from '../../types'

interface ContextMenuProps {
  top: number
  left: number
  open: boolean
  rightClickedRow: ReactTableRow<object>
}

const ContextMenuWrapper = styled.div<{
  top: number
  left: number
  open: boolean
}>`
  position: fixed;
  width: 200px;
  border-radius: 5px;
  z-index: 1000;
  background-color: #fff;
  color: rgba(0, 0, 0, 0.87);
  -webkit-transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 4px;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  ${({ top, left, open }) => css`
    top: ${top}px;
    left: ${left}px;
    display: ${open ? 'block' : 'none'};
  `}
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  ul li {
    cursor: pointer;
    text-decoration: none;
    min-height: 48px;
    padding-top: 6px;
    padding-bottom: 6px;
    box-sizing: border-box;
    white-space: nowrap;
    padding-left: 16px;
    padding-right: 16px;
    font-weight: 400;
    font-size: 1rem;
    line-height: 2.1;
    letter-spacing: 0.00938em;
  }
  ul li:hover {
    text-decoration: none;
    background-color: rgba(0, 0, 0, 0.04);
  }
`

const ContextMenu = ({
  top,
  left,
  open,
  rightClickedRow,
}: ContextMenuProps) => {
  const { removeTrade: removeTradeData, setTradeStatus } = useTrade()
  const webSocketClient = useWebSocketClient()
  const highlight = (rightClickedRow?.original as TradeEntity)?.highlight

  const removeTrade = useCallback(() => {
    const { tradeId } = rightClickedRow.original as TradeEntity
    webSocketClient
      .request<DeleteTradeAPIReturn>({
        eventType: 'deleteTrade',
        tradeId,
      })
      .subscribe(({ code }) => {
        if (ResponseCode.Success === code) {
          removeTradeData(tradeId)
        } else alert('Sorry, fail to delete trade')
      })
  }, [rightClickedRow])

  const highlightRow = useCallback(() => {
    const { tradeId, highlight } = rightClickedRow.original as TradeEntity
    setTradeStatus(tradeId, { highlight: !highlight })
  }, [rightClickedRow])

  return (
    <ContextMenuWrapper top={top} left={left} open={open}>
      <ul>
        <li onClick={removeTrade}>remove</li>
        <li onClick={highlightRow}>
          {highlight ? 'cancal highlight' : 'highlight'}
        </li>
      </ul>
    </ContextMenuWrapper>
  )
}

export default ContextMenu

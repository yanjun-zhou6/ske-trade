import styled, { css } from 'styled-components'

interface ContextMenuProps {
  top: number
  left: number
  open: boolean
}

const ContextMenuWrapper = styled.div<ContextMenuProps>`
  position: fixed;
  width: 200px;
  background-color: #383838;
  border-radius: 5px;
  box-sizing: border-box;
  z-index: 1000;
  ${({ top, left, open }) => css`
    top: ${top}px;
    left: ${left}px;
    display: ${open ? 'block' : 'none'};
  `}
  ul {
    box-sizing: border-box;
    padding: 10px;
    margin: 0;
    list-style: none;
  }
  ul li {
    padding: 18px 12px;
  }
  /* hover */
  ul li:hover {
    cursor: pointer;
    background-color: #000000;
  }
`

const ContextMenu = ({ top, left, open }: ContextMenuProps) => {
  return (
    <ContextMenuWrapper top={top} left={left} open={open}>
      <ul>
        <li>Edit</li>
        <li>Copy</li>
        <li>Delete</li>
      </ul>
    </ContextMenuWrapper>
  )
}

export default ContextMenu

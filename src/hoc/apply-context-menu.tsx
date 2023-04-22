import { useEffect, useState } from 'react'
import Row from '../components/Table/Row'
import ContextMenu from '../components/ContextMenu'

const applyContextMenu = (RawRow: typeof Row) => {
  const ContextMenuRow = (props: Parameters<typeof Row>[0]) => {
    const [clicked, setClicked] = useState(false)
    const [points, setPoints] = useState({
      x: 0,
      y: 0,
    })

    useEffect(() => {
      const handleClick = () => setClicked(false)
      window.addEventListener('click', handleClick)
      return () => {
        window.removeEventListener('click', handleClick)
      }
    }, [])

    const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault()
      setClicked(true)
      setPoints({
        x: e.clientX,
        y: e.clientY,
      })
      console.log('Right Click', e.clientX, e.clientY)
    }

    return (
      <div onContextMenu={onContextMenu}>
        <RawRow {...props}></RawRow>
        <ContextMenu
          top={points.y}
          left={points.x}
          open={clicked}
        ></ContextMenu>
      </div>
    )
  }

  return ContextMenuRow
}

export default applyContextMenu

/**
 * @description useSyncExternalStore 监听鼠标位置。
 *
 * 函数签名
 * export function useSyncExternalStore<Snapshot>(
 *      subscribe: (onStoreChange: () => void) => () => void,
 *      getSnapshot: () => Snapshot,
 *      getServerSnapshot?: () => Snapshot,
 * ): Snapshot;
 *
 * getSnapshot: 期望获取的数据快照
 * subscribe: 订阅函数，用于监听数据变化
 * getServerSnapshot: 服务端渲染时的快照
 */
import { useSyncExternalStore } from 'react'

interface MousePosition {
  x: number
  y: number
}

const mouseStore = {
  position: { x: 0, y: 0 } as MousePosition
}

const Example = () => {
  const getSnapshot = () => mouseStore.position
  const subscribe = (onStoreChange: () => void) => {
    function onMouseMove(event: MouseEvent) {
      mouseStore.position = { x: event.clientX, y: event.clientY }
      onStoreChange()
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }

  const position = useSyncExternalStore(subscribe, getSnapshot)

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        04-useSyncExternalStore
      </h2>
      <p className="text-2xl font-bold mb-4">鼠标位置追踪器</p>
      <div className="text-lg">
        <p>X坐标: {position.x}</p>
        <p>Y坐标: {position.y}</p>
      </div>
    </div>
  )
}

export default Example

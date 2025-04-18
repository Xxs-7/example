/**
 * @description 使用 useDeferredValue 优化输入框过滤大量数据的场景
 * @detail useDeferredValue 可以创建一个延迟响应的值，类似于防抖的效果，但不需要额外的定时器逻辑。
 * 当用户在输入框中快速输入时，输入框本身会立即响应，而使用 useDeferredValue 包装的过滤结果会延迟更新，
 * 避免每次按键都触发昂贵的渲染操作，从而保持界面的响应性。
 *
 * 函数签名：
 * export function useDeferredValue<T>(value: T): T;
 *
 * 使用场景：
 * 1. 处理大量数据的过滤和搜索
 * 2. 延迟更新不那么重要的UI部分
 * 3. 在不阻塞用户输入的情况下处理计算密集型操作
 */
import { useDeferredValue, useState, useMemo } from 'react'

// 慢速渲染的列表项组件
const SlowItem = ({ item = 0 }: { item: number }) => {
  const now = performance.now()
  while (performance.now() - now < 1) {
    // 模拟一个耗时的操作
  }

  return (
    <div className="p-2 bg-blue-200 text-blue-700 text-center rounded">
      {item}
    </div>
  )
}

// 慢速渲染的列表组件
const SlowList = ({ query }: { query: string }) => {
  // 创建一个包含2000个元素的数组
  const allItems = useMemo(() => Array.from({ length: 2000 }, (_, i) => i), [])

  // 根据查询条件过滤数据
  const filteredItems = useMemo(() => {
    console.log('过滤数据，查询条件:', query)
    if (!query) return allItems
    return allItems.filter((item) => String(item).includes(query))
  }, [allItems, query])

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">
        搜索结果: {filteredItems.length} 项
      </h2>
      <div className="grid grid-cols-10 gap-1 max-h-60 overflow-auto">
        {filteredItems.map((item) => (
          <SlowItem key={item} item={item} />
        ))}
      </div>
    </div>
  )
}

// 不使用 useDeferredValue 的示例
const WithoutDeferredValue = () => {
  const [query, setQuery] = useState('')

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-red-600">
        不使用 useDeferredValue
      </h2>
      <p className="mb-4 text-gray-600">
        输入时会感觉到明显的卡顿，因为每次输入都会立即触发昂贵的重新渲染
      </p>
      <p>切勿尝试，非常卡</p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入数字进行搜索..."
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <SlowList query={query} />
    </div>
  )
}

// 使用 useDeferredValue 的示例
const WithDeferredValue = () => {
  const [query, setQuery] = useState('')
  // 使用 useDeferredValue 创建一个延迟响应的值
  const deferredQuery = useDeferredValue(query)

  // 通过比较原始值和延迟值，可以知道是否正在等待更新
  const isStale = query !== deferredQuery

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">01-useDefferedValue</h2>
      <p className="mb-4 text-gray-600">
        输入时界面保持响应，列表更新会延迟但不会阻塞用户输入
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入数字进行搜索..."
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isStale && (
        <div className="mt-2 text-sm text-gray-500 animate-pulse">
          更新中...
        </div>
      )}

      {/* 传入延迟值而不是原始值 */}
      <SlowList query={deferredQuery} />
    </div>
  )
}

const UseDeferredValueExample = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">
        useDeferredValue 最佳实践
      </h1>
      <p className="mb-8 text-gray-700 text-center">
        useDeferredValue 用于创建延迟响应的值，优化用户体验。下面对比了有无使用
        useDeferredValue 的效果差异。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WithoutDeferredValue />
        <WithDeferredValue />
      </div>
    </div>
  )
}

export default UseDeferredValueExample

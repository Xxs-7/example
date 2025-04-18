/**
 * @description 使用 useTransition 实现页面切换更好的体验
 * @detail 在 SlowComponent 组件是一个渲染比较慢的组件，它会在页面上渲染2000个元素，需要2秒加载完成。切换页面时，使用 useTransition 可以实现页面切换时，页面可以不被卡在 SlowComponent 组件上。
 *
 * 函数签名：
 * export function useTransition(): [boolean, TransitionStartFunction];
 *
 * 例如：const [isPending, startTransition] = useTransition()
 * isPending 代表当前 update 触发的渲染任务处于正在执行
 * startTransition 用于标记 setState 产生的 update 为 transition update
 */
import { useState, useTransition } from 'react'

// 快速渲染的组件1
const FastComponent1 = () => {
  return (
    <div className="p-6 bg-blue-100 rounded-lg shadow-md transition-card hover:shadow-lg hover:scale-[1.02]">
      <h2 className="text-2xl font-bold mb-3 text-blue-800">快速渲染组件 1</h2>
      <p className="text-blue-600">这个组件可以立即渲染完成</p>
    </div>
  )
}

// 快速渲染的组件2
const FastComponent2 = () => {
  return (
    <div className="p-6 bg-green-100 rounded-lg shadow-md transition-card hover:shadow-lg hover:scale-[1.02]">
      <h2 className="text-2xl font-bold mb-3 text-green-800">快速渲染组件 2</h2>
      <p className="text-green-600">这个组件也可以立即渲染完成</p>
    </div>
  )
}

// 慢速渲染的组件
const SlowItem = ({ item = 0 }: { item: number }) => {
  const now = performance.now()
  while (performance.now() - now < 1) {
    // 模拟一个耗时的操作
  }

  return (
    <div key={item} className="p-2 bg-red-200 text-red-700 text-center rounded">
      {item}
    </div>
  )
}

const SlowComponent = () => {
  const items = Array.from({ length: 2000 }, (_, i) => i)

  return (
    <div className="p-6 bg-red-100 rounded-lg shadow-md transition-card hover:shadow-lg hover:scale-[1.02]">
      <h2 className="text-2xl font-bold mb-3 text-red-800">慢速渲染组件</h2>
      <p className="text-red-600 mb-4">这个组件需要2秒加载，并渲染2000个元素</p>
      <div className="grid grid-cols-10 gap-1 max-h-60 overflow-auto">
        {items.map((item) => (
          <SlowItem key={item} item={item} />
        ))}
      </div>
    </div>
  )
}

// 主组件
function TransitionDemo() {
  const [tab, setTab] = useState('fast1')
  const [tabContent, setTabContent] = useState('fast1')
  const [isPending, startTransition] = useTransition()

  const handleTabChange = (newTab: string) => {
    setTab(newTab)
    startTransition(() => {
      setTabContent(newTab)
    })
  }

  return (
    <div className="max-w-4xl min-h-screen mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">01-useTransiton</h2>

      <div className="mb-6 flex gap-3 justify-center">
        <button
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            tab === 'fast1'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleTabChange('fast1')}
        >
          快速组件1
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            tab === 'fast2'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleTabChange('fast2')}
        >
          快速组件2
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            tab === 'slow'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleTabChange('slow')}
        >
          慢速组件
        </button>
      </div>

      {isPending ? (
        <div className="text-gray-500 text-center animate-pulse mb-4">
          <span className="inline-block">切换中</span>
          <span className="inline-block animate-bounce">...</span>
        </div>
      ) : (
        <div className="mt-6 animate-fade-in">
          {tabContent === 'fast1' && <FastComponent1 />}
          {tabContent === 'fast2' && <FastComponent2 />}
          {tabContent === 'slow' && <SlowComponent />}
        </div>
      )}
    </div>
  )
}

export default TransitionDemo

/**
 * @description 使用 useActionState 管理顺序 Actions
 * @detail 快速点击 fetch next item 按钮，会依次触发请求，即使每个请求的延迟时间不同，结果仍会按照请求顺序返回。
 *
 */

import { useActionState } from 'react'

// 模拟异步请求：等待 delay 毫秒，返回字符串
function fakeApiCall(count: number) {
  return new Promise<string>((resolve, reject) => {
    const delay = Math.random() * 1000 // 1 秒之间
    setTimeout(() => {
      if (Math.random() < 0.3) {
        reject(new Error('❌ Request failed'))
      }
      resolve(`✅ Fetched item #${count} after ${Math.round(delay)}ms`)
    }, delay)
  })
}

type State = {
  items: {
    id: number
    status: 'fetching' | 'success' | 'error'
    message: string
  }[]
  count: number
}

function UseActionDataSequential() {
  const [state, submitAction, isPending] = useActionState(
    async (prevState: State, formData: FormData | void) => {
      const retryId =
        formData instanceof FormData
          ? Number(formData.get('retryId'))
          : undefined
      const newCount = retryId || prevState.count + 1
      let newItem = {
        id: newCount,
        status: 'fetching',
        message: `Fetching item #${newCount}...`
      }

      try {
        const result = await fakeApiCall(newCount)
        newItem = {
          id: newCount,
          status: 'success',
          message: result
        }
      } catch (error) {
        newItem = {
          id: newCount,
          status: 'error',
          message: `Fetched item #${newCount} fail`
        }
      }

      return {
        items: retryId
          ? prevState.items.map((item) =>
              item.id === retryId ? newItem : item
            )
          : [...prevState.items, newItem],
        count: Math.max(prevState.count, newCount)
      } as State
    },
    {
      items: [],
      count: 0
    }
  )

  return (
    <div className="p-6 max-w-md mx-auto font-mono">
      <h2 className="text-2xl font-bold mb-4 text-center">
        03-useActionState + 顺序请求示例
      </h2>
      <div className="space-y-2 text-gray-700 mb-4">
        <p className="text-sm">
          这是一个展示 useActionState
          处理顺序请求的示例组件。它的特点是：即使多个请求的响应时间不同，结果也会按照请求的顺序返回。
        </p>
        <p className="text-sm">
          点击 "Fetch Next Item"
          按钮来触发新的请求。每个请求会在1秒内随机完成，您可以快速连续点击按钮来观察顺序效果。
        </p>
        <p className="text-sm">
          请求结果将按照点击顺序在下方列表中展示，包含请求序号和响应时间信息。
        </p>
        <p className="text-sm">
          如果某个请求失败，您可以点击 "重试" 按钮来重新发起该请求。
        </p>
      </div>
      <form action={submitAction}>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center w-full"
        >
          Fetch Next Item
        </button>
      </form>

      <ul className="mt-6 space-y-2">
        {state.items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center justify-between p-2 rounded ${
              item.status === 'error'
                ? 'bg-red-100'
                : item.status === 'fetching'
                ? 'bg-yellow-100'
                : 'bg-green-100'
            }`}
          >
            {item.message}
            {item.status === 'error' && (
              <form action={submitAction} className="flex">
                <input type="hidden" name="retryId" value={item.id} />
                <button
                  type="submit"
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                  disabled={isPending}
                >
                  重试
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
      {isPending ? (
        <div className="flex items-center justify-center mt-4 text-gray-600">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          加载中...
        </div>
      ) : null}
    </div>
  )
}

export default UseActionDataSequential

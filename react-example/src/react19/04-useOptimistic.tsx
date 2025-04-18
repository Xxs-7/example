/**
 * @description 使用 useOptimistic 在 Actions 还未完成就渲染
 * @detail
 * useOptimistic 是对状态（state）更新的“乐观更新”封装，在异步场景中，让 UI 立即响应用户操作，然后再异步确认结果（成功时确认，失败时回退）。
 * 在异步场景中，如果使用 useState 进行状态管理，往往需要在异步操作完成后再更新状态。
 * useOptimistic 在使用上，相当于 useState 的封装，需要有一个基准的 state 作为入参，但页面上组件的渲染依赖于 useOptimistic 返回的 state。
 *
 * 函数签名
 * export function useOptimistic<State>(
 *   passthrough: State,
 * ): [State, (action: State | ((pendingState: State) => State => void];
 *
 * export function useOptimistic<State, Action>(
 *   passthrough: State,
 *   reducer: (state: State, action: Action) => State,
 * ): [State, (action: Action) => void];
 *
 * 参数：passthrough: State, reducer: (state: State, action: Action) => State,
 * passthrough: 初始状态
 * reducer: 状态更新函数，控制 passthrough 如何转化成返回的 State。
 *    接收两个参数：
 *      state: 上一次的 state
 *      action: 触发 state 更新的动作
 *    返回新的 state
 *
 * 返回值：[State, (action: Action) => void];
 * 返回值跟 useState 的返回值类似，当前的 state 和触发 state 更新的函数。
 *
 * 注意：
 * useOptimistic 必须结合 startTransition 或 form action 使用
 * React 需要根据 action（网络请求）的结果选择是否回退 state，这依赖于捕获异步操作的状态
 *
 * 使用 useOptimistic 的好处
 * 单体数据：像点赞这样的单个状态，好处不明显
 * 列表数据：像消息列表，好处明显。在频繁发送消息时，React 能够自动管理多个异步操作的状态，
 * 如果某个异步操作失败，React 也能自动更新对应位置的组件。这些如果在手动管理，是相当麻烦。
 */

import { useOptimistic, useActionState, startTransition, useState } from 'react'

// 模拟API调用 - 返回问候消息，有随机延迟和随机成功/失败
const greetUser = async (name: string): Promise<string> => {
  // 随机延迟1-2秒
  const delay = 1000 + Math.random() * 1000

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 90%概率成功，10%概率失败
      if (Math.random() > 0.5) {
        resolve(`👋 你好，${name}！服务器响应成功 (${Math.round(delay)}ms)`)
      } else {
        reject(new Error('网络错误：请求失败'))
      }
    }, delay)
  })
}

// 模拟点赞API调用
const likeApi = async (
  isLiking: boolean
): Promise<{ success: boolean; count: number }> => {
  // 随机延迟1-2秒
  const delay = 1000 + Math.random() * 1000

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 80%概率成功，20%概率失败
      if (Math.random() > 0.2) {
        resolve({
          success: true,
          count: isLiking ? 1 : 0
        })
      } else {
        reject(new Error('网络错误：点赞操作失败'))
      }
    }, delay)
  })
}

type FormState = {
  messages: Array<{
    id: number
    text: string
    status: 'optimistic' | 'success' | 'error'
  }>
  nextId: number
}
// 定义点赞状态类型
type LikeState = {
  count: number
  isLiked: boolean
  isPending: boolean
}

// 点赞功能示例
const OptimisticExample1 = () => {
  // 使用useState管理基础状态
  const [likeState, setLikeState] = useState<LikeState>({
    count: 0,
    isLiked: false,
    isPending: false
  })

  // 使用useOptimistic实现乐观更新
  const [optimisticLikeState, setOptimisticLike] = useOptimistic(
    likeState,
    (state: LikeState, isLiking: boolean) => ({
      count: isLiking ? state.count + 1 : state.count - 1,
      isLiked: isLiking,
      isPending: true
    })
  )

  // 处理点赞/取消点赞
  const handleLikeToggle = () => {
    const newLikeStatus = !optimisticLikeState.isLiked

    // 触发乐观更新
    // 必须结合 startTransition 或 form action 使用 useOptimistic
    // startTransition 中，需要使用 async 函数，如果使用回调函数的形式，promise 会被吃掉，React 不能知道异步操作的状态
    // 底层是 startTransition 捕获异步状态
    startTransition(async () => {
      // 应用乐观更新
      // 执行实际API调用
      setOptimisticLike(newLikeStatus)
      try {
        await likeApi(newLikeStatus)

        setLikeState({
          count: newLikeStatus ? likeState.count + 1 : likeState.count - 1,
          isLiked: newLikeStatus,
          isPending: false
        })
      } catch (error) {
        console.error('点赞失败:', error)
      }
    })
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md font-mono">
      <h1 className="text-2xl font-bold mb-4 text-center">❤️ 点赞功能示例</h1>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl font-bold">{optimisticLikeState.count}</div>

        <button
          onClick={handleLikeToggle}
          disabled={optimisticLikeState.isPending}
          className={`
            px-6 py-3 rounded-full flex items-center gap-2 transition-all
            ${
              optimisticLikeState.isLiked
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
            ${optimisticLikeState.isPending ? 'opacity-70' : 'opacity-100'}
          `}
        >
          {optimisticLikeState.isPending && (
            <span className="inline-block animate-spin">⏳</span>
          )}
          <span className="text-xl">
            {optimisticLikeState.isLiked ? '❤️ 已点赞' : '🤍 点赞'}
          </span>
        </button>

        <p className="text-sm text-gray-500 mt-2">
          提示：系统有20%概率模拟请求失败
        </p>
      </div>
    </div>
  )
}

const OptimisticExample = () => {
  // 使用useActionState管理表单状态和提交操作
  const [formState, formAction] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      const name = formData.get('name') as string

      if (!name.trim()) {
        return prevState // 如果名字为空，不做任何操作
      }

      try {
        // 执行实际API调用
        const greeting = await greetUser(name)

        // 返回更新后的状态
        return {
          messages: [
            ...prevState.messages,
            {
              id: prevState.nextId,
              text: greeting,
              status: 'success' as const
            }
          ],
          nextId: prevState.nextId + 1
        }
      } catch (error) {
        // 处理错误情况
        return {
          messages: [
            ...prevState.messages,
            {
              id: prevState.nextId,
              text: `❌ 无法问候 ${name}: ${(error as Error).message}`,
              status: 'error' as const
            }
          ],
          nextId: prevState.nextId
        }
      }
    },
    { messages: [], nextId: 1 } // 初始状态
  )

  // 使用useOptimistic实现乐观更新
  const [optimisticState, addOptimisticMessage] = useOptimistic(
    formState,
    (state: FormState, newMessage: { name: string; id: number }) => ({
      messages: [
        ...state.messages,
        {
          id: newMessage.id,
          text: `✨ 你好，${newMessage.name}！(乐观更新)`,
          status: 'optimistic' as const
        }
      ],
      nextId: state.messages.length
    })
  )

  // 处理表单提交
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name') as string

    if (!name.trim()) return

    // 触发乐观更新
    // 使用了 action，这里不用 async 了
    startTransition(() => {
      addOptimisticMessage({ name, id: formState.nextId })

      // 提交表单动作
      formAction(formData)

      // 重置表单
      form.reset()
    })
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md font-mono">
      <h2 className="text-2xl font-bold mb-4 text-center">
        04-useOptimistic 示例
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="name"
            placeholder="输入你的名字"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            问候
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          提示：系统有10%概率模拟请求失败
        </p>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-2">消息列表</h2>

        {optimisticState.messages.length === 0 ? (
          <p className="text-gray-500 italic">还没有消息，请提交表单</p>
        ) : (
          <ul className="space-y-2">
            {optimisticState.messages.map((message, index) => (
              <li
                key={index}
                className={`p-3 rounded-lg ${
                  message.status === 'optimistic'
                    ? 'bg-yellow-50 border border-yellow-200'
                    : message.status === 'error'
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-green-50 border border-green-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {message.status === 'optimistic' && (
                    <span className="inline-block animate-spin">⏳</span>
                  )}
                  <span>{message.text}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

const OptimisticExamples = () => {
  return (
    <div className="space-y-12">
      <OptimisticExample1 />
      <OptimisticExample />
    </div>
  )
}
export default OptimisticExamples

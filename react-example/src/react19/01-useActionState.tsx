/**
 * @description 使用 useActionState 管理 Action
 * @detail 组件功能：
 *  1. 输入 Tom，返回成功数据 resolve
 *  2. 输入 Jerry，返回数据库不存在，业务错误 resolve
 *  3. 输入其他，抛出异常，模拟网络请求异常 reject
 * @summary 减少 useState, useEffect 的使用
 * 
 * useActionState:
 * 函数签名：
 *    export function useActionState<State, Payload>(
        action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
        initialState: Awaited<State>,
        permalink?: string,
    ): [state: Awaited<State>, dispatch: (payload: Payload) => void, isPending: boolean];
 * 参数：
 * - action：函数，当按钮被按下或者表单被提交时触发，即执行实际的网络请求逻辑
 *    参数：
 *    - state: 上一次执行 handle 的 state
 *    - Payload: 输入数据
 *    返回值：执行结果更新到返回的 state 中；
 * - initialState: 用来初始化返回的 state 的值。
 * - permalink? 服务端渲染中用来生成可恢复状态的唯一标识符，客户端渲染可以忽略
 * 返回值：
 *   - state: 当前状态，即 action 执行后的结果
 *   - dispatch: 触发 action 的函数，相当于 action 的 wrapper，将 payload 传递给 action
 *   - isPending: 是否正在执行 action
 * 
 * 重点：useActionState 默认不会捕获错误，要手动捕获错误
 *  1. 把错误当成 state的一部分
 *  2. error boundary
 */

import { startTransition, useActionState, useState } from 'react'

type DataResponse = { code: number; message: string; error?: string }
function request(name: string) {
  return new Promise<DataResponse>((resolve, reject) => {
    setTimeout(() => {
      if (name === 'Tom') {
        resolve({ code: 200, message: 'Hello, Tom!' })
      } else if (name === 'Jerry') {
        resolve({ code: 404, message: 'No such Name' })
      } else {
        reject(new Error('Invalid name'))
      }
    }, 1000)
  })
}

function NewComponent() {
  const [name, setName] = useState('')
  const [response, handleSubmit, isPending] = useActionState<
    DataResponse,
    string
  >(
    async (_previousState, name) => {
      console.log('prev', _previousState)
      try {
        const res = await request(name)
        return res
      } catch (error) {
        return {
          code: '500',
          message: '',
          error: (error as Error).message
        } as unknown as DataResponse
      }
    },
    {
      code: 0,
      message: ''
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const onSubmit = () => {
    startTransition(() => {
      handleSubmit(name)
    })
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="space-y-2 text-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-center">
            01-useActionState 示例
          </h2>
          <p className="text-sm">
            这是一个使用 useActionState
            管理异步操作的示例组件。通过输入不同的名字来测试不同的响应情况：
          </p>
          <p className="text-sm">
            <span className="font-medium">• 输入 "Tom"</span>
            ：将返回成功响应，显示欢迎消息
          </p>
          <p className="text-sm">
            <span className="font-medium">• 输入 "Jerry"</span>
            ：将返回业务错误，提示用户不存在
          </p>
          <p className="text-sm">
            <span className="font-medium">• 输入其他名字</span>
            ：将触发异常，模拟网络请求失败
          </p>
          <p className="text-sm italic">
            组件会在加载状态时禁用提交按钮，并优雅地处理所有错误情况。
          </p>
        </div>
        <div>
          <input
            value={name}
            onChange={handleChange}
            placeholder="请输入名字"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <button
            onClick={onSubmit}
            disabled={isPending}
            className={`w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
              isPending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isPending ? '提交中...' : '提交'}
          </button>
        </div>
        {response.message && (
          <h1 className="text-xl font-semibold text-gray-800 break-words">
            {response.message}
          </h1>
        )}

        {response.error && (
          <p className="text-red-500 text-sm mt-2">{response.error}</p>
        )}
      </div>
    </div>
  )
}

export default NewComponent

/**
 * @description useActionData 结合 form 标签
 * @detail 同 01-useActionData.tsx
 *
 */

import { useActionState, useState } from 'react'

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

function FormActionExample() {
  const [name, setName] = useState('')
  const [response, handleSubmit, isPending] = useActionState<
    DataResponse,
    string
  >(
    async (_previousState, name) => {
      try {
        const res = await request(name)
        return res
      } catch (error) {
        return {
          code: 500,
          message: '',
          error: (error as Error).message
        }
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(name)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2 text-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center">
          02-useActionState + form 示例
        </h2>
        <p className="text-sm">
          这是一个使用 useActionState，结合 form 标签
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
      <form onSubmit={onSubmit} className="space-y-4">
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
            type="submit"
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
      </form>
    </div>
  )
}

export default FormActionExample

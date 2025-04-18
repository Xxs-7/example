/**
 * use 是一个 React API，它可以让你读取类似于 Promise 或 context 的资源的值。
 * 函数签名：
 *  export type Usable<T> = PromiseLike<T> | Context<T>;
 *  export function use<T>(usable: Usable<T>): T;
 */

import React, { createContext, Suspense, use, useCallback } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

type DataResponse = { code: number; message: string; error?: string }
function request() {
  return new Promise<DataResponse>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        resolve({ code: 200, message: 'Hello, Tom!' })
      } else {
        reject(new Error('随机错误：请求失败'))
      }
    }, 1000)
  })
}

/**
 * use 可以在任何函数组件内调用。
 * 它的执行原理是，promise 的状态会被 react 缓存，直到 promise 被 resolve 或者 reject 后，再重新渲染组件。也就是会执行两遍组件函数。
 * 所以，不能用 use(request())，因为两次执行 UseForPromise 中，request() 返回的是不同的 promise。
 *
 * 也就是 use 替换了传统使用 useEffect(() => {}, []) 的初始化数据的场景。
 *
 * Suspense 代表 promise pending 状态时展示的内容
 * ErrorBoundary 代表 promise reject 状态时展示的内容
 */
interface MessageProps {
  dataPromise: Promise<DataResponse>
}

function Message({ dataPromise }: MessageProps) {
  const data = use(dataPromise)

  return (
    <div className="p-4 bg-white rounded-lg shadow-md transition-all hover:shadow-lg">
      {data.message}
    </div>
  )
}

function UseForPromise() {
  const dataPromise = request()

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-100 text-red-600 rounded-lg border border-red-200">
          出错了：请刷新重试
        </div>
      }
    >
      <Suspense
        fallback={
          <p className="p-4 text-gray-500 animate-pulse">
            waiting for message...
          </p>
        }
      >
        <Message dataPromise={dataPromise} />
      </Suspense>
    </ErrorBoundary>
  )
}

/**
 * use 可以在条件语句如 if 和循环如 for 内调用。相比之下，use 比 useContext更加灵活。
 * 说实话没啥用处，反而会让代码变得复杂
 */
const ThemeContext = createContext<string>('light')

function ThemeComponent() {
  const theme = use(ThemeContext)

  return (
    <div
      className={`p-4 rounded-lg transition-colors ${
        theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'
      }`}
    >
      current theme: {theme}
    </div>
  )
}

function UseForContext() {
  const [theme, setTheme] = React.useState('light')
  const onThemeChange = useCallback(() => {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'))
  }, [setTheme])

  return (
    <ThemeContext.Provider value={theme}>
      <button
        onClick={onThemeChange}
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Toggle Theme
      </button>
      <ThemeComponent />
    </ThemeContext.Provider>
  )
}

function UseExample() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">05-use</h2>
      <p className="text-gray-600 mb-4">
        React use Hook 示例展示了两种主要用法：Promise处理和Context访问。use
        Hook可以直接读取Promise和Context的值，
        简化了异步数据获取和上下文管理的代码。
      </p>
      <div className="space-y-4">
        <p className="text-gray-600">
          Promise示例：随机模拟API请求，展示加载中状态（灰色动画）、成功状态（白色消息框）和失败状态（红色错误提示）。
          失败时可以刷新页面重试。
        </p>
        <UseForPromise />
      </div>
      <div className="space-y-4">
        <p className="text-gray-600">
          Context示例：通过切换按钮在浅色/深色主题间切换，展示use
          Hook在访问Context时的灵活性。 主题变化会实时反映在UI上。
        </p>
        <UseForContext />
      </div>
    </div>
  )
}

export default UseExample

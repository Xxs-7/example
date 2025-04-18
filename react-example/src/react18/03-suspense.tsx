/**
 * @description React Suspense和SuspenseList示例
 * @detail 展示如何使用Suspense处理异步加载的组件，以及如何使用SuspenseList协调多个Suspense组件的加载顺序和显示方式
 */

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

// 模拟API请求函数，返回不同延迟的Promise
function fetchData(id: number, delay: number) {
  return new Promise<{ id: number; name: string; description: string }>(
    (resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.5) {
          reject(new Error('请求失败'))
          return
        }
        resolve({
          id,
          name: `项目 ${id}`,
          description: `这是项目 ${id} 的详细描述，加载耗时 ${delay}ms`
        })
      }, delay)
    }
  )
}

// 创建资源加载器
function createResource<T>(promise: Promise<T>) {
  let status = 'pending'
  let result: T
  let error: Error

  const suspender = promise.then(
    (data) => {
      status = 'success'
      result = data
    },
    (e) => {
      status = 'error'
      error = e
    }
  )

  return {
    read() {
      if (status === 'pending') {
        throw suspender
      } else if (status === 'error') {
        throw error
      } else {
        return result
      }
    }
  }
}

// 创建三个不同加载时间的资源
const resources = [
  createResource(fetchData(1, 1000)), // 1秒
  createResource(fetchData(2, 2000)), // 2秒
  createResource(fetchData(3, 3000)) // 3秒
]

// 项目卡片组件
function ProjectCard<
  T extends { id: number; name: string; description: string }
>({ resource, bgColor }: { resource: { read(): T }; bgColor: string }) {
  const data = resource.read()

  return (
    <div
      className={`p-4 rounded-lg shadow-md ${bgColor} transition-all duration-300 hover:shadow-lg`}
    >
      <h3 className="text-xl font-bold mb-2">{data.name}</h3>
      <p className="text-gray-700">{data.description}</p>
    </div>
  )
}

// 加载中组件
function LoadingFallback({ id }: { id: number }) {
  return (
    <div className="p-4 rounded-lg shadow-md bg-gray-100 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="mt-2 text-sm text-gray-500">正在加载项目 {id}...</div>
    </div>
  )
}

// 错误边界的回退UI
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-100 text-red-600 rounded-lg border border-red-200">
      <p className="font-bold">加载失败</p>
      <p>{error.message}</p>
    </div>
  )
}

// 展示不同的SuspenseList模式
function SuspenseDemo() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">03-Suspense</h2>

      <div className="space-y-12">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            刷新
          </button>
        </div>
        <section>
          <h2 className="text-2xl font-bold mb-4">嵌套加载示例</h2>
          <p className="mb-4 text-gray-600">
            通过Suspense嵌套控制组件的加载顺序
          </p>

          <div className="grid grid-cols-1 gap-4">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingFallback id={1} />}>
                <ProjectCard resource={resources[0]} bgColor="bg-blue-100" />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingFallback id={2} />}>
                <ProjectCard resource={resources[1]} bgColor="bg-green-100" />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoadingFallback id={3} />}>
                <ProjectCard resource={resources[2]} bgColor="bg-purple-100" />
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SuspenseDemo

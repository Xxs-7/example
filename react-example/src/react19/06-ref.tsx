import React, { useRef, useState } from 'react'

// 定义子组件暴露给父组件的方法类型
interface InputRefHandle {
  focus: () => void
  getValue: () => string
}

// 直接使用ref作为props传递给子组件
const CustomInput = ({
  ref,
  placeholder
}: {
  ref: React.RefObject<InputRefHandle>
  placeholder?: string
}) => {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // 直接将方法赋值给ref.current
  if (ref.current === null) {
    ref.current = {
      focus: () => inputRef.current?.focus(),
      getValue: () => value
    }
  }

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
    />
  )
}

function RefClearExample() {
  const [isShow, setIsShow] = useState(true)
  const setRef = (ref: HTMLButtonElement | null) => {
    if (ref) {
      const handle = () => {
        console.log('clicked')
      }
      ref.addEventListener('click', handle)
      return () => {
        console.log('remove')
        ref.removeEventListener('click', handle)
      }
    }
  }

  return (
    <div>
      <button onClick={() => setIsShow(!isShow)}>show</button>
      {isShow && <button ref={setRef}>click me</button>}
    </div>
  )
}

// 主组件
function RefExample() {
  const inputRef = useRef<InputRefHandle>(null)

  const handleFocusClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">06-ref</h2>
      <div className="space-y-4">
        <CustomInput
          ref={inputRef as React.RefObject<InputRefHandle>}
          placeholder="请输入内容"
        />
        <div className="space-x-4">
          <button
            onClick={handleFocusClick}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            聚焦输入框
          </button>
        </div>
        <div className="space-y-4">
          <RefClearExample />
        </div>
      </div>
    </div>
  )
}

export default RefExample

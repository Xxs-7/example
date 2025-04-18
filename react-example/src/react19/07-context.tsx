import React, { use } from 'react'

const ThemeContext = React.createContext({
  theme: 'light',
  setTheme: (_theme: string) => {}
})

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState('light')
  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}

function ThemeComponent() {
  const { theme, setTheme } = use(ThemeContext)
  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  return (
    <div
      className="flex flex-col items-center justify-center p-6 min-h-[200px] transition-colors duration-300"
      style={{ backgroundColor: theme === 'light' ? '#f3f4f6' : '#1f2937' }}
    >
      <h2 className="text-2xl font-bold text-gray-800">07-context</h2>

      <div
        className="text-xl font-semibold mb-4"
        style={{ color: theme === 'light' ? '#111827' : '#f9fafb' }}
      >
        当前主题：{theme}
      </div>
      <button
        onClick={handleThemeChange}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
      >
        切换主题
      </button>
    </div>
  )
}

function ContextExample() {
  return (
    <ThemeProvider>
      <ThemeComponent />
    </ThemeProvider>
  )
}

export default ContextExample

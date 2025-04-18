import './App.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'

// React 18
import UseTransitionExample from './react18/01-useTransition'
import UseDeferredValueExample from './react18/02-useDeferredValue'
import SuspenseExample from './react18/03-suspense'
import UseSyncExternalStoreExample from './react18/04-useSyncExternalStore'

// React 19
import UseActionStateExample from './react19/01-useActionState'
import UseActionDataFormExample from './react19/02-useActionState-form'
import UseActionDataSequentialExample from './react19/03-useActionState-sequential'
import UseOptimisticExample from './react19/04-useOptimistic'
import UseExample from './react19/05-use'
import RefExample from './react19/06-ref'
import ContextExample from './react19/07-context'

const Home = () => {
  return <div>hello react</div>
}

const router = createHashRouter([
  {
    path: '/',
    children: [
      { index: true, element: <Home /> },
      { path: 'UseTransitionExample', element: <UseTransitionExample /> },
      { path: 'UseDeferredValueExample', element: <UseDeferredValueExample /> },
      { path: 'SuspenseExample', element: <SuspenseExample /> },
      {
        path: 'UseSyncExternalStoreExample',
        element: <UseSyncExternalStoreExample />
      },
      { path: 'UseActionStateExample', element: <UseActionStateExample /> },
      {
        path: 'UseActionDataFormExample',
        element: <UseActionDataFormExample />
      },
      {
        path: 'UseActionDataSequentialExample',
        element: <UseActionDataSequentialExample />
      },
      { path: 'UseOptimisticExample', element: <UseOptimisticExample /> },
      { path: 'UseExample', element: <UseExample /> },
      { path: 'RefExample', element: <RefExample /> },
      { path: 'ContextExample', element: <ContextExample /> }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App

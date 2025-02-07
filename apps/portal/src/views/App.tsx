
import GlobalProvider from '@taskboard/client/hooks/global/provider'
import PortalView from './portal/PortalView'
import { BrowserRouter } from 'react-router-dom'



function App() {

  return (
    <BrowserRouter>
      <GlobalProvider
        config={
          {
            urls: {
              api: import.meta.env.VITE_API_URL,
              auth: import.meta.env.VITE_AUTH_URL
            },
            environment: import.meta.env.VITE_MODE
          }
        }
        authenticated={(auth) => <PortalView auth={auth} />}
        unauthenticated={() => <>Redirecting...</>}
      />
    </BrowserRouter>
  )
}

export default App

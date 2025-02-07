import AuthenticationView from './auth/AuthenticationView'
import { AuthenticatedView } from './auth/AuthenticatedView'
import GlobalProvider from '@taskboard/client/hooks/global/provider'



function App() {


  return (
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
      authenticated={(auth) => <AuthenticatedView auth={auth} />}
      unauthenticated={(auth) => <AuthenticationView auth={auth} />}
    />
  )
}

export default App

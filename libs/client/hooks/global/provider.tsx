import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { useAuth } from "./use-auth"
import { useTheme } from "./use-theme"
import { useAPI } from "./use-api"
import { Authenticated, Unauthenticated } from "@taskboard/types"


export default function GlobalProvider(props: {
  authenticated: (authenticated: Authenticated) => ReactNode,
  unauthenticated: (unauthenticated: Unauthenticated) => ReactNode,
  config: {
    urls: {
      auth: string,
      api: string
    }
    environment?: 'DEV' | 'PROD'
  }
}) {
  const { authenticated, unauthenticated, config } = props
  const queryClient = new QueryClient()
  const auth = useAuth.init({ queryClient, url: config.urls.auth })
  const api = useAPI.init({ auth, url: config.urls.api })
  const theme = useTheme.init({})

  return (
    <useAuth.Provider value={auth} children={
      <QueryClientProvider client={queryClient} children={
        <useAPI.Provider value={api} children={
          <useTheme.Provider value={theme} children={
            auth.user
              ? authenticated(auth)
              : unauthenticated(auth)
          } />
        } />
      } />
    } />
  )
}
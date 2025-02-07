import { Account, Authenticated } from "@taskboard/types"
import { useQuery } from "@tanstack/react-query"

import ManagerView from "./ManagerView"
import { useAPI } from "@taskboard/client/hooks/global/use-api"
import { useEffect } from "react"
import { useAuthenticated } from "@taskboard/client/hooks/global/use-auth"



function PortalView(props: { auth: Authenticated }) {

  const authenticated = useAuthenticated.init({ auth: props.auth })

  const api = useAPI.context()
  const { data: account } = useQuery<Account | null>({
    queryKey: ['account', props.auth.user.uuid],
    queryFn: async () => (await api.get('/accounts/user')).data
  })

  useEffect(() => {
    if (account === null)
      window.location.href = import.meta.env.VITE_HUB_URL + '/setup'
  }, [account])

  if (account) {
    return (
      <useAuthenticated.Provider value={authenticated}>
        {
          account.is_manager ? <ManagerView account={account} />
            : <div children={'ASSOCIATE VIEW'} />
        }
      </useAuthenticated.Provider>

    )
  }
  else
    return <div children={'Redirecting...'} />
}

export default PortalView



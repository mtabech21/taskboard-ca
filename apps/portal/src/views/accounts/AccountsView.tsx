import AccountManager from "./AccountManager"


function AccountsView() {
  const a = false
  return (

    a
      ? <AccountManager />
      : <div className="text-red-500">NO ACCESS</div>

  )
}

export default AccountsView
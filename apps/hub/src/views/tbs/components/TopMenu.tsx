import { LogOut, PanelTop, Settings, SquareCode } from "lucide-react"
import logo from '@assets/images/logo.svg'
import { useAuthenticated } from "@taskboard/client/hooks/global/use-auth"

function TopMenu() {

  const { user, signOut } = useAuthenticated.context()

  return (
    <div className='p-4 flex justify-between border-b'>
      <img alt="logo" draggable="false" style={{ maxHeight: "2em" }} src={logo} />
      <div className='flex gap-2 items-center'>
        <div title='Full Screen' className='flex align-middle font-bold p-1 rounded text-sm hover: cursor-pointer hover:bg-slate-200' onClick={() => { !document.fullscreenElement ? document.body.requestFullscreen() : document.exitFullscreen() }}><SquareCode /></div>
        <a title='Portal' className='flex align-middle font-bold p-1 rounded text-sm hover: cursor-pointer hover:bg-slate-200' href={import.meta.env.VITE_PORTAL_URL + '/branches'}><PanelTop /></a>
        <div title='Settings' className='flex align-middle font-bold p-1 rounded text-sm hover: cursor-pointer hover:bg-slate-200' ><Settings /></div>
        <div className='font-mono flex justify-center items-center  hover:bg-gray-100 gap-2 px-2 rounded cursor-default border'>
          <div className="whitespace-nowrap text-ellipsis">{`${user.first_name} ${user.last_name}`}</div>
        </div>
        <div title='Sign out' className='flex align-middle border text-red-600 font-bold p-1 rounded text-sm hover: cursor-pointer hover:bg-slate-200 ' onClick={signOut}><LogOut /></div>
      </div>
    </div>
  )
}

export default TopMenu
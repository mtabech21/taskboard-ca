
import logo from './assets/taskboard-logo-default.svg'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'



function App() {
  const client = new QueryClient({})

  return (
    <QueryClientProvider client={client}>
      <div className='flex h-full w-full flex-col items-center bg-gray-100 '>
        <NavigationMenu />
        <main className='max-sm:py-10 py-20 w-full h-full flex flex-col items-center overflow-y-scroll gap-10' >
          <div className='flex aspect-video w-full max-w-screen-lg gap-3 font-tb_medium text-2xl'>
            <div className='bg-gray-900 h-full basis-1/3 rounded shadow text-white flex justify-center items-center hover:scale-[1.03] transition-all ' children='Track Attendance' />
            <div className='flex flex-col h-full w-full gap-3'>
              <div className='bg-blue w-full basis-1/4 rounded shadow flex justify-center items-center text-white hover:scale-[1.03] transition-all' children='Monitor Budgets' />
              <div className='bg-white flex-1 rounded shadow flex justify-center items-center hover:scale-[1.03] transition-all' children='Follow Up On Tasks' />
            </div>
          </div>
          <div className='max-sm:text-4xl text-5xl font-tb_medium p-1 max-w-screen-xl'>User friendly solution to help increase efficiency and track workforce development.</div>
          <div className='max-sm:text-lg text-2xl font-tb_medium'>Tailored for <span className='text-red-600'>Canadian</span> Businesses.</div>

        </main>
      </div>
    </QueryClientProvider>
  )
}

function NavigationMenu() {
  return (
    <div className='w-full h-fit flex justify-center shadow-md static whitespace-nowrap bg-white z-10 select-none'>
      <div className='flex justify-between w-full h-fit p-2 items-center max-w-screen-xl' >
        <div className='min-w-40'>
          <img src={logo} alt='logo' />
        </div>
        <div className='flex justify-evenly font-tb_medium items-center gap-5  '>
          <div className='bg-blue p-2 px-4 transition-all  rounded-full text-white select-none cursor-pointer hover:opacity-75'>Easy Quote</div>
          <div className='text-sm max-sm:px-3 px-8 gap-2 flex items-center '>
            <div className='max-sm:hidden'>Already using Taskboard?</div>
            <a href='/' className='text-blue font-bold hover:underline cursor-pointer'>Go to hub</a>
          </div>
        </div>
      </div >
    </div >
  )
}

export default App

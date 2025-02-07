

export function BottomBar() {

  return (
    <div className="bg-white w-full flex justify-center border-t">
      <div style={{ color: "rgb(20,105,185)" }} className=" py-2 px-5 w-fit rounded hover:text-slate-100 cursor-pointer flex gap-3 underline text-sm" onClick={() => window.open(import.meta.env.VITE_PORTAL_URL + `/associates/timecards?`)}>
        <div>Manage Timecards</div>
      </div>
    </div>
  )

}

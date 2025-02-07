import { DateRange } from 'react-day-picker'
import { Loader, RefreshCcw } from 'lucide-react'
import { AssociateItem } from '@taskboard/types'
import { Button } from '@shad/button'
import { useTimecard } from '@taskboard/client/hooks/payroll/use-timecard'
import { LoadingView } from '../auth/components/LoadingView'
import TimecardTable from './timecard/components/Table'
import { Badge } from '@shad/badge'

function AssociateTimecard(props: { associate: AssociateItem, date_range: DateRange }) {
  const { associate, date_range } = props
  const timecard = useTimecard.init({ associate, date_range })

  if (!timecard.data) { return <LoadingView /> }
  else {
    return (
      <useTimecard.Provider value={timecard}>
        <div className="flex flex-1 flex-col justify-start w-full">
          <div className="text-left flex justify-between h-fit p-3 border-b">
            <div className='flex items-center gap-5'>
              <div className="text-4xl">{timecard.data.associate.first_name} {timecard.data.associate.last_name}</div>
              <Badge>{timecard.data.associate.badge_number}</Badge>
            </div>

            <div className=' flex p-1 justify-between gap-1 text-xs'>
              {timecard.isUpdating ? <Loader /> : <Button disabled={timecard.locked} title='Save' className='bg-primary hover:bg-slate-600 border shadow-none font-bold text-xs' onClick={() => { return }}>SAVE</Button>}
              <Button title='Refresh' size={'icon'} className='text-primary bg-white hover:bg-slate-100 border shadow-none' onClick={() => timecard.refetch()}><RefreshCcw size={16} /></Button>
            </div>
          </div>
          <TimecardTable data={timecard.data} />
          <div className='flex-1' />
          {timecard.latest_update && <div className='p-2 m-0 text-xs bg-gray-100'>Last Updated: {timecard.latest_update.toString()}</div>}
        </div>
      </useTimecard.Provider>
    )
  }
}




export default AssociateTimecard
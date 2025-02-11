import { DateRange } from 'react-day-picker'
import { Loader, RefreshCcw } from 'lucide-react'
import { Button } from '@shad/button'
import { useTimecard } from '@taskboard/client/hooks/payroll/use-timecard'
import { LoadingView } from '../auth/components/LoadingView'
import TimecardTable from './timecard/components/Table'
import { AssociateBadgeHeader } from '../profile/AssociateProfileView'
import { AssociateBadge } from '@taskboard/types'

function AssociateTimecard(props: { associate: AssociateBadge, date_range: DateRange }) {
  const { associate, date_range } = props
  const timecard = useTimecard.init({ associate, date_range })

  if (!timecard.data) { return <LoadingView /> }
  else {
    return (
      <useTimecard.Provider value={timecard}>
        <div className="flex flex-1 flex-col justify-start w-full">
          <AssociateBadgeHeader badge={props.associate} className='p-5 border-b' />
          <TimecardTable data={timecard.data} />
          {timecard.latest_update && <div className='p-2 m-0 text-xs bg-gray-100'>Last Updated: {timecard.latest_update.toString()}</div>}
        </div>
      </useTimecard.Provider >
    )
  }
}




export default AssociateTimecard
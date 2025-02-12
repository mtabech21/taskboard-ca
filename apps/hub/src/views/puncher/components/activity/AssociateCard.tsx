import { IoPerson } from "react-icons/io5";
import { Card } from "@shad/card";
import { AssociateBadge, Punch, TimecardPunch } from "@taskboard/types";



function AssociateCard(props: { data: { badge: AssociateBadge, status?: Punch } }) {
  const { badge, status } = props.data

  return (
    <Card className="m-1 rounded overflow-hidden hover:bg-gray-100">
      <div className="flex p-3 h-14 justify-between items-center">
        <div className="flex items-center justify-between gap-5">
          {status ? <StatusIcon latest={status} /> : 'NO DATA'}
          <div className="whitespace-nowrap font-medium select-none" title={`${badge.first_name} ${badge.last_name}`}>
            {`${badge.first_name} ${badge.last_name[0]}.`}
          </div>
        </div>
        {status?.timestamp ? <LatestActivity latest={status} span={undefined} /> : 'NO DATA'}
      </div>
      {/* {props.data.punches ? reveal && <AssociateLog data={props.data.punches} /> : null} */}
    </Card >
  );
}



function LatestActivity(props: { latest: TimecardPunch, span: string | undefined }) {
  const latest = props.latest
  const timeString = new Date(latest.timestamp).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })
  const color = `${latest.type === 'in' ? "green" : latest.type === 'out' ? "gray" : latest.type === 'meal' ? "orange" : "red"}`


  return (
    <div className="flex justify-start items-center gap-3 flex-grow-1 select-none">
      <div style={{ backgroundColor: color, color: "whitesmoke" }} className="px-3 py-1 rounded whitespace-nowrap">
        {timeString}
      </div>
      <div className="font-semibold w-20" style={{ color: color }}>
        {(Number(props.span?.split(':')[0]) === 0)
          ? 'Now'
          : latest.type === 'in' && '+' + latest.type !== 'out' && props.span}
      </div>
    </div>
  )
}

function StatusIcon(props: { latest: Punch }) {
  const color = `${props.latest.type === 'in' ? "green" : props.latest.type === 'out' ? "gray" : props.latest.type === 'meal' ? "orange" : "red"}`
  return (
    <IoPerson style={{ color: color, fontSize: '1.5em' }} />

  )
}

export default AssociateCard
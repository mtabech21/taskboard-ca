import { IoPerson } from "react-icons/io5";
import { Card } from "@shad/card";
import { useAssociateCard } from "../../../../hooks/puncher/useAssociateCard";
import { AssociatePunches, TimecardPunch } from "@taskboard/types";



function AssociateCard(props: { data: AssociatePunches; }) {

  const { setReveal, latest, span } = useAssociateCard(props.data);

  return (
    <Card className="m-1 rounded overflow-hidden hover:bg-gray-100">
      <div className="flex p-3 h-14 justify-between items-center" onClick={() => setReveal((prev) => !prev)}>
        <div className="flex items-center justify-between gap-5">
          <StatusIcon latest={latest} />
          <div className="whitespace-nowrap font-medium select-none" title={`${props.data.badge.first_name} ${props.data.badge.last_name}`}>
            {`${props.data.badge.first_name} ${props.data.badge.last_name[0]}.`}
          </div>
        </div>
        {latest.timestamp && <LatestActivity latest={latest} span={span} />}
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

function StatusIcon(props: { latest: TimecardPunch }) {
  const color = `${props.latest.type === 'in' ? "green" : props.latest.type === 'out' ? "gray" : props.latest.type === 'meal' ? "orange" : "red"}`
  return (
    <IoPerson style={{ color: color, fontSize: '1.5em' }} />

  )
}

export default AssociateCard
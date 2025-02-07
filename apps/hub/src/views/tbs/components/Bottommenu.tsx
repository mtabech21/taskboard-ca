import { IoCashOutline, IoDocumentsOutline, IoSwapHorizontal, IoTicketOutline } from 'react-icons/io5'
import { IconType } from 'react-icons'
import { BsBoxes } from 'react-icons/bs'
import style from '../../../styles/tb.module.scss'


function BottomMenu() {
  return (
    <div style={{ display: "flex", height: '4em' }} className={style.grayTop}>
      <div className={style.bottomMenu}>
        <BTN title='Transfers' icon={IoSwapHorizontal} />
        <BTN title='Shipments' icon={BsBoxes} />
        <BTN title='Deposits' icon={IoCashOutline} />
        <BTN title='Documents' icon={IoDocumentsOutline} />
        <BTN title='Ticket Issue' icon={IoTicketOutline} />
        {/* <BTN title='RISM' icon={GenIcon(logo as IconTree)} /> */}
        {/* <BTN title='Info' icon={IoInformationCircleOutline}  />
      <BTN title='Settings' icon={IoSettingsOutline} action={() => {}}/> */}
      </div>
      <div style={{ display: 'flex', height: "100%", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", color: "gray", padding: '2em', fontSize: '0.8em' }}>
        COPYRIGHT © 2024 METE SOLUTIONS INC.
      </div>
    </div>
  )
}

const BTN = (props: {
  title: string
  icon: IconType
  action?: () => void
}) => {

  return (
    <div className={style.bottomMenuOption} onClick={props.action}>
      {<props.icon style={{ fontSize: "2em", fontWeight: 'bold' }} />}
      <div style={{ fontSize: "0.8em", color: "gray" }}>{props.title}</div>
    </div>
  )
}

export default BottomMenu
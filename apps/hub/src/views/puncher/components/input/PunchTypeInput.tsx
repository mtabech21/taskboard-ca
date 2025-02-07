import style from "../../../../styles/tb.module.scss"
import { usePunchTypeInput } from "../../../../hooks/puncher/usePunchTypeInput";
import { PunchTypeSelection } from "./PunchTypeSelection";

const PunchTypeInput = () => {
  const { selections, selectedType, handleSubmit, handleCancel } = usePunchTypeInput()


  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: 'space-evenly', height: '100%' }}>

      <div style={{ width: '60%', minWidth: 'fit-content', display: "flex", alignItems: "center", justifyContent: 'center', whiteSpace: 'nowrap' }}>
        {selections.map((pt) => <PunchTypeSelection key={pt} submit={handleSubmit} type={pt} selection={selectedType} onHover={() => { console.log('') }} />)}
      </div>

      <div className={style.selectOptions}>
        <div onClick={handleCancel} >Cancel <span style={{ color: "gray", fontFamily: 'monospace' }}>[X]</span></div>
      </div>

    </div>
  );
};

export default PunchTypeInput;

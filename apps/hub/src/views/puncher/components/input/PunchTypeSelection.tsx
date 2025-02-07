import { IoPizza } from "react-icons/io5";
import { MdOutlinePaid } from "react-icons/md";
import { RiLoginCircleLine, RiLogoutCircleRLine } from "react-icons/ri";
import React, { useRef } from "react";
import { useEffect } from "react";
import style from "../../../../styles/tb.module.scss";
import { SelectionProps } from "../../../../types";


export const PunchTypeSelection = (props: SelectionProps) => {

  const ref = useRef<React.LegacyRef<HTMLButtonElement>>() as React.LegacyRef<HTMLButtonElement>;

  useEffect(() => {
    if (props.selection === props.type) {
      if (ref) {
        //@ts-expect-error current
        ref.current.focus();
      }
    }
  }, [props.selection, ref, props.type]);

  const iconClockIn = <RiLoginCircleLine className={style.clockSelectIcon} />;
  const iconClockOut = <RiLogoutCircleRLine className={style.clockSelectIcon} />;
  const iconMeal = <IoPizza className={style.clockSelectIcon} />;
  const iconPaid = <MdOutlinePaid className={style.clockSelectIcon} />;

  return (
    <form onSubmit={(e) => props.submit(e, props.type)}
      className={style.clockSelectType}>
      <button
        ref={ref}
        className={style.clockSelectType}
        onMouseOver={(e) => {
          e.currentTarget.focus();
          props.onHover();
        }}
      >
        <div>{props.type === 'in' ? "Clock In" : props.type === 'out' ? "Clock Out" : props.type === 'meal' ? "Meal Break" : props.type === 'paid' ? "Paid Break" : "ERROR"}</div>
        {props.type === 'in' ? iconClockIn : props.type === 'out' ? iconClockOut : props.type === 'meal' ? iconMeal : props.type === 'paid' ? iconPaid : null}
      </button>
    </form>
  );
};

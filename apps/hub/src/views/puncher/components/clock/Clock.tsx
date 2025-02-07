import { usePuncher } from "@taskboard/client/hooks/puncher/use-puncher";




function Clock() {

  const { clock } = usePuncher.context()

  return (
    <div
      className="p-3 select-none bg-white w-full"
      style={{
        borderBottom: "1px solid rgba(136, 136, 136, 0.226)",
      }}
    >
      <div className="font-mono font-semibold whitespace-nowrap text-blue text-xl p-2" >
        {clock.getCurrentDate()}
      </div>
      <div className="font-mono font-semibold whitespace-nowrap text-black text-6xl p-2" >
        {clock.currentTime.toLocaleTimeString(["en-US"], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

export default Clock;

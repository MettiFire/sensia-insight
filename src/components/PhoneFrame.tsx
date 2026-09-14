import { useEffect, useState, type ReactNode } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-0 transition-colors dark:bg-black sm:p-6">
      <div className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-slate-50 shadow-2xl transition-colors dark:bg-slate-950 sm:h-[844px] sm:w-[400px] sm:rounded-[2.75rem] sm:border-[10px] sm:border-slate-900 dark:sm:border-slate-800">
        <div className="flex shrink-0 items-center justify-between px-6 pb-1 pt-3 text-[11px] font-semibold text-slate-900 dark:text-slate-100">
          <span>{time}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3.5 w-3.5" />
            <Wifi className="h-3.5 w-3.5" />
            <BatteryFull className="h-4 w-4" />
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

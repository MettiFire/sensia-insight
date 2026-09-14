import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-0 transition-colors dark:bg-black sm:p-6">
      <div className="relative flex h-[100svh] w-full flex-col overflow-hidden bg-slate-50 shadow-2xl transition-colors dark:bg-slate-950 sm:h-[844px] sm:w-[400px] sm:rounded-[2.75rem] sm:border-[10px] sm:border-slate-900 dark:sm:border-slate-800">
        <div
          className="shrink-0"
          style={{ paddingTop: "max(env(safe-area-inset-top), 12px)" }}
        />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

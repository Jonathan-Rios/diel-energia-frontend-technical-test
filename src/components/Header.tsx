import { Link, useLocation } from "react-router-dom";

export interface HeaderProps {}

export function Header() {
  const location = useLocation();

  return (
    <div className="flex w-full h-16 items-end justify-end mb-4">
      <div className="gap-4">
        <Link
          to="/"
          className={`rounded-[4px] py-1 p-8 font-bold ${location.pathname === "/" ? "bg-cyan-600 text-white" : "border-cyan-600 text-cyan-600"}`}
        >
          Diário
        </Link>

        <Link
          to="/weekly"
          className={`rounded-[4px] py-1 p-8 font-bold ${location.pathname === "/weekly" ? "bg-cyan-600 text-white" : "border-cyan-600 text-cyan-600"}`}
        >
          Semanal
        </Link>

        <Link
          to="/monthly"
          className={`rounded-[4px] py-1 p-8 font-bold ${location.pathname === "/monthly" ? "bg-cyan-600 text-white" : "border-cyan-600 text-cyan-600"}`}
        >
          Mensal
        </Link>
      </div>
    </div>
  );
}

/* 
import { ViewMode } from "@/constants/ViewMode";

export interface HeaderProps {
  changeViewMode: (option: ViewMode) => void;
  selectedViewMode: ViewMode;
}

export function Header({ selectedViewMode, changeViewMode }: HeaderProps) {
  return (
    <div className="flex w-full h-16 items-end justify-end mb-4">
      <div className="gap-4">
        <button
          className={`rounded-[4px] py-1 p-8 font-bold ${selectedViewMode === ViewMode.Daily ? "bg-cyan-600 text-white" : "border-cyan-600 text-cyan-600"}`}
          onClick={() => changeViewMode(ViewMode.Daily)}
        >
          Diário
        </button>

        <button
          className={`rounded-[4px] py-1 p-8 font-bold ${selectedViewMode === ViewMode.Weekly ? "bg-cyan-600 text-white" : "border-cyan-600 text-cyan-600"}`}
          onClick={() => changeViewMode(ViewMode.Weekly)}
        >
          Semanal
        </button>

        <button
          className={`rounded-[4px] py-1 p-8 font-bold ${selectedViewMode === ViewMode.Monthly ? "bg-cyan-600 text-white" : "border-cyan-600 text-cyan-600"}`}
          onClick={() => changeViewMode(ViewMode.Monthly)}
        >
          Mensal
        </button>
      </div>
    </div>
  );
}
 */

import clsx from "clsx"
import { RotateCcw, Zap } from "lucide-react"

// ─── Shared: analyze / re-scan button ──────────────────────────────────────────
export default function AnalyzeButton({ isAnalyzing, hasResults, onAnalyze, onReset, analyzeLabel, resetLabel }) {
  if (hasResults) {
    return (
      <button
        onClick={onReset}
        className="w-full bg-brand-surface border border-brand-border rounded-xl py-3.5 text-sm font-semibold text-brand-dark flex items-center justify-center gap-2 hover:bg-brand-border transition-colors"
      >
        <RotateCcw size={14} /> {resetLabel}
      </button>
    )
  }
  return (
    <button
      onClick={onAnalyze}
      disabled={isAnalyzing}
      className={clsx(
        "w-full rounded-xl py-4 text-base font-bold flex items-center justify-center gap-2.5 transition-opacity",
        isAnalyzing ? "bg-zinc-600 text-white cursor-wait" : "bg-brand-dark text-white hover:opacity-90"
      )}
    >
      {isAnalyzing ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Analyzing…
        </>
      ) : (
        <>
          <Zap size={17} className="text-brand-yellow" /> {analyzeLabel}
        </>
      )}
    </button>
  )
}

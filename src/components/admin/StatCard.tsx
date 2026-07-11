import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
}) {
  return (
    <div className="rounded-3xl border border-sage-200/70 bg-white/80 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</span>
        <Icon className="h-4 w-4 text-sage-500" />
      </div>
      <p className="mt-3 text-2xl font-bold text-english-900">{value}</p>
      {typeof trend === "number" && (
        <p className={cn("mt-1 text-xs font-medium", trend >= 0 ? "text-sage-600" : "text-red-500")}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend).toFixed(1)}% vs. mes anterior
        </p>
      )}
    </div>
  );
}
